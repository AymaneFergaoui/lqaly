import Parser from 'rss-parser';
import { google } from 'googleapis';
import OpenAI from 'openai';
import { Octokit } from '@octokit/rest';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();
dotenv.config({ path: '../.env.local' });

// Configuration mapping
const config = {
  claudeBaseUrl: process.env.CLAUDE_BASE_URL || 'https://ai.atozservices.lu/litellm',
  claudeApiKey: process.env.CLAUDE_API_KEY || 'sk-WhYR7E_rYqS8v-x4oR1cUw',
  githubToken: process.env.GITHUB_TOKEN,
  githubOwner: process.env.GITHUB_OWNER,
  githubRepo: process.env.GITHUB_REPO,
  githubBranch: process.env.GITHUB_BRANCH || 'master',
  postsDirectory: process.env.POSTS_DIRECTORY || 'frontend/src/content/blog',
  googleServiceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  googleSheetId: process.env.GOOGLE_SHEET_ID,
  rssDataSheet: 'RSS Data',
  wpDataSheet: 'Lqaly Data',
  rssFeedUrls: (process.env.RSS_FEED_LQALY || '').split(',').map(u => u.trim()).filter(Boolean),
};

// Validate configuration
function validateConfig() {
  const requiredKeys: (keyof typeof config)[] = [
    'claudeApiKey', 'githubToken', 'githubOwner', 'githubRepo',
    'googleServiceAccountEmail', 'googlePrivateKey', 'googleSheetId'
  ];
  const missing = requiredKeys.filter(k => !config[k]);
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
  if (config.rssFeedUrls.length === 0) {
    console.warn(`⚠️ No RSS_FEED_LQALY provided in .env. Attempting to run anyway, but might not find content.`);
  }
}

// Services Initialization
let sheets: any;
let octokit: Octokit;
let openai: OpenAI;
let parser: Parser;

async function initServices() {
  console.log("🔄 Initializing services...");

  // Google Sheets Auth
  const auth = new google.auth.JWT({
    email: config.googleServiceAccountEmail,
    key: config.googlePrivateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  sheets = google.sheets({ version: 'v4', auth });

  // GitHub Octokit
  octokit = new Octokit({ auth: config.githubToken });

  // OpenAI / LiteLLM
  openai = new OpenAI({
    baseURL: config.claudeBaseUrl,
    apiKey: config.claudeApiKey,
  });

  // RSS Parser
  parser = new Parser();
}

interface ArticleData {
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  permalinkSlug: string;
  internalLinks: string;
  externalLinks: string;
  keywordStrategy: string;
  contentGaps: string;
  contentStructure: string;
  imagePrompt: string;
  category: string;
}

/**
 * Reads the first column of the RSS Data sheet to get processed URLs.
 */
async function getProcessedUrls(): Promise<Set<string>> {
  console.log(`📊 Fetching processed URLs from Google Sheets (${config.rssDataSheet})...`);
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.googleSheetId,
      range: `${config.rssDataSheet}!A:A`,
    });
    const rows = response.data.values || [];
    const urls = rows.map((row: string[]) => row[0]).filter(Boolean);
    return new Set(urls);
  } catch (error: any) {
    console.error("❌ Failed to fetch from Google Sheets:", error.message);
    throw error;
  }
}

/**
 * Logs a processed URL to the RSS Data sheet.
 */
async function logRssUrl(url: string) {
  console.log(`✅ Marking RSS URL as processed: ${url}`);
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: config.googleSheetId,
      range: `${config.rssDataSheet}!A:B`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[url, new Date().toISOString()]],
      },
    });
  } catch (error: any) {
    console.error(`❌ Failed to log RSS URL to Google Sheets:`, error.message);
  }
}

/**
 * Logs the generated SEO data to the WordPress Data sheet.
 */
async function logWordPressData(data: ArticleData, status: string = 'Done') {
  console.log(`📊 Saving generated SEO data to ${config.wpDataSheet}...`);
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: config.googleSheetId,
      range: `${config.wpDataSheet}!A:M`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          data.metaTitle,
          data.metaDescription,
          data.primaryKeyword,
          data.secondaryKeywords,
          data.permalinkSlug,
          data.internalLinks,
          data.externalLinks,
          data.keywordStrategy,
          data.contentGaps,
          data.contentStructure,
          data.imagePrompt,
          data.category,
          status
        ]],
      },
    });
  } catch (error: any) {
    console.error(`❌ Failed to log WordPress data:`, error.message);
  }
}

function cleanRssSnippet(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/The post\s+.*?\s+appeared first on\s+.*?(\.|$)/gi, '')
    .replace(/appeared first on\s+.*?(\.|$)/gi, '')
    .replace(/\[\.\.\.\]/g, '')
    .replace(/Comments/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanAndParseJson(text: string): any {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.substring(start, end + 1);
  }
  return JSON.parse(cleaned);
}

function slugifyFrench(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function isLikelyEnglish(str: string): boolean {
  if (!str) return false;
  const englishPatterns = [
    /\b(for rent|for sale|renter's guide|local guide|apartments|villas|riads|triplexes|the post|appeared first on|how to|top \d+|discover|find|what to expect)\b/i,
    /\b(does .* work|origin story|five years later|is here|hacked|trained at home|shut down|falls to|in an \$\d+|bedroom|living in)\b/i
  ];
  return englishPatterns.some(p => p.test(str));
}

/**
 * Ensures all SEO data fields are strictly in French, translating if necessary.
 */
async function ensureFrenchSeoData(data: ArticleData, sourceTitle: string, sourceSummary: string): Promise<ArticleData> {
  const needsTranslation = 
    !data.metaTitle || 
    isLikelyEnglish(data.metaTitle) || 
    !data.metaDescription || 
    isLikelyEnglish(data.metaDescription) || 
    isLikelyEnglish(data.permalinkSlug) ||
    isLikelyEnglish(data.primaryKeyword);

  if (needsTranslation) {
    console.log(`🌐 [Agent SEO] Détection d'éléments en anglais ou manquants. Traduction et adaptation en français...`);
    const transPrompt = `
Tu es un rédacteur et consultant SEO expert pour Lqaly, une plateforme immobilière de prestige au Maroc.
Le titre ou les métadonnées de l'article source ci-dessous sont en ANGLAIS ou incomplets.
Tu DOIS les traduire, les adapter et les optimiser STRICTEMENT EN FRANÇAIS pour le public marocain et francophone.

Source Title : "${sourceTitle}"
Source Summary : "${cleanRssSnippet(sourceSummary)}"
Titre actuel : "${data.metaTitle || sourceTitle}"
Description actuelle : "${data.metaDescription || ''}"
Mot-clé actuel : "${data.primaryKeyword || ''}"

Réponds UNIQUEMENT avec un objet JSON valide contenant ces 4 champs STRICTEMENT EN FRANÇAIS :
{
  "metaTitle": "Titre engageant et optimisé SEO en français (max 60 caractères)",
  "metaDescription": "Méta description percutante en français (150-160 caractères, sans mention de Sarouty ou source externe)",
  "primaryKeyword": "mot-clé principal en français (ex: location riad azzouzia marrakech)",
  "permalinkSlug": "slug-kebab-case-en-francais-sans-accent"
}
`;
    try {
      const resp = await openai.chat.completions.create({
        model: "claude-sonnet-4.6",
        messages: [{ role: "user", content: transPrompt }]
      });
      const parsed = cleanAndParseJson(resp.choices[0].message?.content || '{}');
      if (parsed.metaTitle) data.metaTitle = parsed.metaTitle;
      if (parsed.metaDescription) data.metaDescription = parsed.metaDescription;
      if (parsed.primaryKeyword) data.primaryKeyword = parsed.primaryKeyword;
      if (parsed.permalinkSlug) data.permalinkSlug = slugifyFrench(parsed.permalinkSlug);
    } catch (err: any) {
      console.warn("⚠️ Échec de la traduction IA d'urgence:", err.message);
    }
  }

  // Nettoyage final des résidus
  if (data.metaDescription) {
    data.metaDescription = cleanRssSnippet(data.metaDescription);
  }

  if (!data.metaTitle || isLikelyEnglish(data.metaTitle)) {
    throw new Error("Génération annulée : metaTitle est manquant ou invalide.");
  }

  if (!data.metaDescription || data.metaDescription.length < 20 || isLikelyEnglish(data.metaDescription)) {
    throw new Error("Génération annulée : metaDescription est manquante ou invalide.");
  }

  if (data.permalinkSlug) {
    data.permalinkSlug = slugifyFrench(data.permalinkSlug);
  } else {
    data.permalinkSlug = slugifyFrench(data.metaTitle);
  }

  return data;
}

/**
 * Agent 1: Generates SEO data (JSON) based on an RSS feed item.
 */
async function analyzeArticleSEO(feedItem: any): Promise<ArticleData> {
  console.log(`🕵️ [Agent 1] Analyzing article and generating SEO Data: "${feedItem.title}"...`);

  let sourceSummary = cleanRssSnippet(feedItem.contentSnippet || feedItem.content || "No summary provided.");
  if (sourceSummary.trim().toLowerCase() === 'comments' || !sourceSummary) {
    sourceSummary = "No summary provided.";
  }

  const prompt = `
Tu es un Directeur SEO et Stratège de Contenu senior spécialisé dans l'immobilier au Maroc pour Lqaly, une plateforme immobilière de référence.
Ton rôle est d'analyser l'article source et de concevoir une stratégie de contenu originale et performante EN FRANÇAIS.

Article Source :
- Titre Source : ${feedItem.title}
- Résumé Source : ${sourceSummary}
- URL Source : ${feedItem.link}

⚠️ EXIGENCE LINGUISTIQUE ABSOLUE : 100% EN FRANÇAIS (FRENCH ONLY)
Même si le titre source, le résumé ou le flux RSS est en ANGLAIS, TOUTES les valeurs de ton objet JSON doivent être STRICTEMENT TRADUITES ET RÉDIGÉES EN FRANÇAIS.
AUCUN mot en anglais n'est autorisé dans les valeurs du JSON.

Tu DOIS retourner un objet JSON avec les champs suivants (les clés doivent rester en anglais, mais toutes les valeurs DOIVENT être en français) :
- "metaTitle": Un titre accrocheur, vendeur et optimisé SEO rédigé STRICTEMENT EN FRANÇAIS (max 60 caractères). Ex: "Location de Riads à Azzouzia Marrakech : Guide et Prix". Ne conserve JAMAIS le titre source en anglais !
- "metaDescription": Une méta description captivante et incitative STRICTEMENT EN FRANÇAIS (150-160 caractères). Ne JAMAIS inclure d'anglais ni de mention telle que "The post ... appeared first on ...".
- "primaryKeyword": Le mot-clé principal STRICTEMENT EN FRANÇAIS (ex: "location riad azzouzia marrakech", et SURTOUT PAS "riads for rent").
- "secondaryKeywords": 3 à 5 mots-clés secondaires LSI séparés par des virgules, STRICTEMENT EN FRANÇAIS.
- "permalinkSlug": Un slug d'URL en minuscules kebab-case STRICTEMENT EN FRANÇAIS basé sur le mot-clé principal français, sans accents (ex: "location-riad-azzouzia-marrakech", et SURTOUT PAS "riads-for-rent...").
- "internalLinks": Liste de 3 URLs internes suggérées relatives au sujet (ex: "https://lqaly.com/villas, https://lqaly.com/marrakech, https://lqaly.com/contact").
- "externalLinks": Liste de 3 URLs externes d'autorité relatives au sujet (portails institutionnels ou économiques).
- "keywordStrategy": Recommandations d'intégration des mots-clés et variantes sémantiques en français.
- "contentGaps": Analyse des lacunes du contenu source que notre article doit combler en français.
- "contentStructure": Plan détaillé des sections H2 et H3 à rédiger en français.
- "imagePrompt": Prompt pour générer une image représentative (peut être en anglais ou français).
- "category": La catégorie la plus appropriée en français (ex: "Immobilier", "Tendances du Marché", "Investissement", "Conseils Pratiques", "Luxe").
`;

  const response = await openai.chat.completions.create({
    model: "claude-sonnet-4.6",
    messages: [{ role: "user", content: prompt }]
  });
  const text = response.choices[0].message?.content || '{}';

  try {
    const data = cleanAndParseJson(text);
    const initialSeoData: ArticleData = {
      metaTitle: data.metaTitle || data.meta_title || data.title || data.titre || data.titreMeta || '',
      metaDescription: data.metaDescription || data.meta_description || data.description || data.descriptionMeta || '',
      primaryKeyword: data.primaryKeyword || data.primary_keyword || data.keyword || data.motClePrincipal || '',
      secondaryKeywords: data.secondaryKeywords || data.secondary_keywords || data.keywords || data.motsCles || '',
      permalinkSlug: data.permalinkSlug || data.permalink_slug || data.slug || data.urlSlug || '',
      internalLinks: data.internalLinks || data.internal_links || '',
      externalLinks: data.externalLinks || data.external_links || '',
      keywordStrategy: data.keywordStrategy || data.keyword_strategy || '',
      contentGaps: data.contentGaps || data.content_gaps || '',
      contentStructure: data.contentStructure || data.content_structure || '',
      imagePrompt: data.imagePrompt || data.image_prompt || '',
      category: data.category || 'Immobilier'
    };

    return await ensureFrenchSeoData(initialSeoData, feedItem.title || '', sourceSummary);
  } catch (error) {
    console.error("❌ Failed to parse SEO JSON from LLM:", text);
    throw new Error("Invalid JSON generated by SEO Agent.");
  }
}

/**
 * Agent 2: Generates an SEO-optimized blog post using the generated SEO Data.
 */
async function generateArticle(data: ArticleData): Promise<string> {
  console.log(`🤖 [Agent 2] Writing content for: "${data.metaTitle}"...`);

  const prompt = `
Tu es un journaliste et rédacteur immobilier senior. Tu DOIS rédiger l'intégralité de l'article en FRANÇAIS (Français soigné) adapté au marché immobilier marocain pour la plateforme Lqaly.

# DONNÉES D'ENTRÉE (SEO)
- **Titre optimisé (Français)**: ${data.metaTitle}
- **Méta Description (Français)**: ${data.metaDescription}
- **Mot-clé Principal**: ${data.primaryKeyword}
- **Mots-clés Secondaires**: ${data.secondaryKeywords}
- **Stratégie de Mots-clés**: ${data.keywordStrategy}
- **Lacunes de Contenu à Combler**: ${data.contentGaps}
- **Structure du Contenu**: ${data.contentStructure}
- **Liens Internes**: ${data.internalLinks}
- **Liens Externes**: ${data.externalLinks}

# EXIGENCE LINGUISTIQUE ABSOLUE : 100% EN FRANÇAIS
- L'intégralité du contenu (titre, chapô, intertitres H2/H3, corps, FAQ, métadonnées) DOIT être rédigée en FRANÇAIS.
- AUCUN mot, titre ou paragraphe en anglais n'est autorisé.

# RÈGLES D'UTILISATION DES DONNÉES
- **Titre optimisé**: Définit l'orientation éditoriale. Utilisez-le pour le positionnement, mais NE RÉPÉTEZ PAS le titre H1 dans le corps du texte (il est géré par le frontmatter YAML).
- **Mot-clé Principal**: Guide la pertinence SEO et la terminologie tout au long de l'article.
- **Structure**: Respectez la progression logique avec des balises Markdown \`##\` (H2) et \`###\` (H3). Ne sautez aucun niveau de titre.
- **Liens internes et externes**: Intégrez-les naturellement selon les règles ci-dessous.

# STYLE RÉDACTIONNEL
- Ouvrez avec une phrase forte, informative et engageante sur l'immobilier marocain.
- Adoptez une structure en pyramide inversée : fait marquant -> contexte -> détails -> exemples concrets -> implications.
- Rédigez des paragraphes courts et digestes (2 à 4 phrases maximum).
- Ton journalistique, expert, neutre et analytique.
- Évitez le remplissage, le sensationnalisme ou le jargon non expliqué.

# SEO & LISIBILITÉ
- **Longueur**: Visez entre 800 et 1200 mots. Article complet, fouillé et riche en valeur ajoutée.
- Intégrez le mot-clé principal naturellement dès les premières phrases.
- Utilisez du formattage dynamique : balises \`**gras**\`, \`<ul>\` (puces), et \`<ol>\` (listes numérotées) pour fluidifier la lecture.
- Tout à la fin de l'article, intégrez OBLIGATOIREMENT une section FAQ en français au format Schema.org :
<h2>FAQ sur ${data.metaTitle.replace(/"/g, '')}</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <h3 itemprop="name">[Question 1 en français]</h3>
        <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
            <p itemprop="text">[Réponse 1 détaillée en français]</p>
        </div>
    </div>
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <h3 itemprop="name">[Question 2 en français]</h3>
        <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
            <p itemprop="text">[Réponse 2 détaillée en français]</p>
        </div>
    </div>
</div>

# DISTRIBUTION DES LIENS
- **Liens internes**: Intégrez-les sous forme de lien Markdown : \`[texte d'ancre naturel](URL_INTERNE)\`.
- **Liens externes**: Pour sourcer des données ou études : \`[texte d'ancre naturel](URL_EXTERNE)\`.
- Répartir les liens de manière équilibrée (au moins 1 au début, 1 au milieu, 1 avant la conclusion). Maximum 1 lien par paragraphe.

# FORMAT DE SORTIE OBLIGATOIRE
1. Sortie STRICTEMENT en Markdown brut (aucun bloc \`\`\`markdown).
2. Frontmatter YAML obligatoire tout en haut du fichier, strictement en FRANÇAIS :
---
id: ${data.permalinkSlug}
slug: ${data.permalinkSlug}
title: "${data.metaTitle.replace(/"/g, '\\"').replace(/\n/g, ' ').replace(/\r/g, '')}"
category: ${data.category}
author: Lqaly
date: ${new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
readTime: 5 min de lecture
isoDate: ${Date.now()}
description: "${data.metaDescription.replace(/"/g, '\\"').replace(/\n/g, ' ').replace(/\r/g, '')}"
coverImage: /images/blog/${data.permalinkSlug}.jpg
---
3. Ne commencez par aucun mot d'introduction comme "Voici l'article :". Démarrez immédiatement par "---".
`;

  const response = await openai.chat.completions.create({
    model: "claude-sonnet-4.6",
    messages: [{ role: "user", content: prompt }]
  });
  let text = response.choices[0].message?.content || '';

  // Cleanup any potential markdown wrapper the AI might still add despite instructions
  text = text.replace(/^```markdown\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');

  return text;
}

/**
 * Commits the markdown file directly to GitHub using the Octokit REST API.
 */
async function commitToGithub(slug: string, content: string) {
  console.log(`🐙 Pushing ${slug}.md to GitHub...`);
  const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const filepath = `${config.postsDirectory}/${cleanSlug}.md`;

  try {
    let sha: string | undefined;
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner: config.githubOwner!,
        repo: config.githubRepo!,
        path: filepath,
        ref: config.githubBranch,
      });
      if (!Array.isArray(data) && 'sha' in data) {
        sha = data.sha;
      }
    } catch (err: any) {
      if (err.status !== 404) throw err;
    }

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: config.githubOwner!,
      repo: config.githubRepo!,
      path: filepath,
      message: `docs(blog): add article ${cleanSlug}`,
      content: Buffer.from(content).toString('base64'),
      branch: config.githubBranch,
      sha,
    });
    console.log(`✅ Successfully committed ${filepath}`);
  } catch (error: any) {
    console.error(`❌ Failed to push to GitHub:`, error.message);
    throw error;
  }
}

/**
 * Downloads an image from Unsplash (via picsum) and saves it locally.
 * Returns the local file path and the buffer.
 */
async function downloadUnsplashImage(slug: string): Promise<{ buffer: Buffer }> {
  console.log(`[Image] Téléchargement d'une image pour ${slug}...`);

  const url = `https://picsum.photos/seed/${slug}/1200/630`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return { buffer };
}

/**
 * Commits the image to GitHub using the Octokit REST API.
 */
async function commitImageToGithub(slug: string, buffer: Buffer) {
  console.log(`🐙 Pushing /images/blog/${slug}.jpg to GitHub...`);
  const filepath = `frontend/public/images/blog/${slug}.jpg`;

  try {
    let sha: string | undefined;
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner: config.githubOwner!,
        repo: config.githubRepo!,
        path: filepath,
        ref: config.githubBranch,
      });
      if (!Array.isArray(data) && 'sha' in data) {
        sha = data.sha;
      }
    } catch (err: any) {
      if (err.status !== 404) throw err;
    }

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: config.githubOwner!,
      repo: config.githubRepo!,
      path: filepath,
      message: `docs(blog): add image for ${slug}`,
      content: buffer.toString('base64'),
      branch: config.githubBranch,
      sha,
    });
    console.log(`✅ Successfully committed ${filepath}`);
  } catch (error: any) {
    console.error(`❌ Failed to push image to GitHub:`, error.message);
  }
}

/**
 * Main execution pipeline
 */
async function main() {
  validateConfig();
  await initServices();

  const processedUrls = await getProcessedUrls();

  if (config.rssFeedUrls.length === 0) {
    console.log("No RSS feeds provided. Exiting.");
    return;
  }

  let articlesProcessed = 0;
  const MAX_ARTICLES = 2;

  for (const feedUrl of config.rssFeedUrls) {
    if (articlesProcessed >= MAX_ARTICLES) break;

    console.log(`\n📡 Fetching feed: ${feedUrl}`);
    try {
      const feed = await parser.parseURL(feedUrl);

      for (const item of feed.items) {
        if (articlesProcessed >= MAX_ARTICLES) {
          console.log(`\n⏹️ Reached maximum limit of ${MAX_ARTICLES} articles per run.`);
          break;
        }
        const itemUrl = item.link || item.guid;

        if (!itemUrl) {
          console.warn("⚠️ Item missing link/guid, skipping:", item.title);
          continue;
        }

        if (processedUrls.has(itemUrl)) {
          console.log(`⏭️  Skipping already processed: ${item.title}`);
          continue;
        }

        console.log(`\n📝 Processing new item: ${item.title}`);

        try {
          // 1. Agent 1: Generate SEO Data (Strictly French)
          const seoData = await analyzeArticleSEO(item);

          // Safeguards: ensure valid metadata exists
          if (!seoData.metaTitle || !seoData.metaDescription) {
            throw new Error("Les métadonnées (titre ou description) n'ont pas été générées correctement.");
          }
          if (!seoData.permalinkSlug) {
            seoData.permalinkSlug = slugifyFrench(seoData.metaTitle);
          }

          // 2. Agent 2: Write Article
          const markdownContent = await generateArticle(seoData);

          // 3. Commit Image and Markdown to GitHub
          const slug = seoData.permalinkSlug;

          const { buffer } = await downloadUnsplashImage(slug);
          await commitImageToGithub(slug, buffer);

          await commitToGithub(slug, markdownContent);

          // 4. Update databases (Lqaly Data)
          await logWordPressData(seoData);
          await logRssUrl(itemUrl);

          articlesProcessed++;

          // Rate limiting protection for Gemini/GitHub
          console.log("⏳ Pausing for 60 seconds to respect free tier rate limits...");
          await new Promise(r => setTimeout(r, 60000));

        } catch (itemError: any) {
          console.error(`❌ Error processing item "${item.title}":`, itemError.message);
        }
      }
    } catch (feedError: any) {
      console.error(`❌ Error fetching feed ${feedUrl}:`, feedError.message);
    }
  }

  console.log("\n🎉 Dual-Agent auto-blogger pipeline execution complete!");
}

main().catch(console.error);
