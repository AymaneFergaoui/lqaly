import Parser from 'rss-parser';
import { google } from 'googleapis';
import OpenAI from 'openai';
import { Octokit } from '@octokit/rest';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: '.env.local' });
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
  unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY || 'CmdAwIJueFh0v7KIl0jcF9qdoGwfvhPiMzi4aQ1Hz5I',
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
      internalLinks: Array.isArray(data.internalLinks) ? data.internalLinks.join(', ') : (data.internalLinks || data.internal_links || ''),
      externalLinks: Array.isArray(data.externalLinks) ? data.externalLinks.join(', ') : (data.externalLinks || data.external_links || ''),
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
 * Builds candidate search queries for Unsplash from French article topics
 */
function buildUnsplashSearchQueries(keyword: string, title: string): string[] {
  const text = `${keyword} ${title}`.toLowerCase();
  const queries: string[] = [];

  if (text.includes('appartement') || text.includes('apartment')) {
    if (text.includes('agadir')) queries.push('agadir apartment architecture');
    queries.push('modern apartment building architecture');
    queries.push('luxury apartment interior modern');
  } else if (text.includes('sci') || text.includes('societe') || text.includes('investiss') || text.includes('patrimoin')) {
    queries.push('luxury real estate investment architecture');
    queries.push('modern luxury property real estate');
    queries.push('modern architectural property morocco');
  } else if (text.includes('riad')) {
    queries.push('moroccan riad traditional architecture');
    queries.push('morocco riad courtyard architecture');
  } else if (text.includes('villa') || text.includes('maison')) {
    queries.push('luxury villa modern architecture');
    queries.push('modern house villa morocco');
  }

  const cleanKeyword = keyword.replace(/[^a-zA-Z\s]/g, ' ').trim().replace(/\s+/g, ' ');
  if (cleanKeyword && cleanKeyword.length > 3 && !queries.includes(cleanKeyword)) {
    queries.unshift(cleanKeyword);
  }

  queries.push('modern luxury real estate architecture');
  queries.push('real estate villa house');
  return queries;
}

/**
 * 1. Génération de l'image de fond via Unsplash API officielle
 */
async function generateRealEstateSubject(promptKeyword: string, title: string): Promise<Buffer> {
  let imageUrl = `https://picsum.photos/1080/1350`;

  if (config.unsplashAccessKey) {
    const candidateQueries = buildUnsplashSearchQueries(promptKeyword, title);
    for (const query of candidateQueries) {
      try {
        console.log(`[Image] Recherche Unsplash pour "${query}"...`);
        const searchUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=portrait&client_id=${config.unsplashAccessKey}`;
        const searchRes = await fetch(searchUrl);
        if (searchRes.ok) {
          const data: any = await searchRes.json();
          if (data?.urls?.regular) {
            imageUrl = data.urls.regular;
            console.log(`[Image] ✅ Image Unsplash trouvée pour "${query}" : ${imageUrl}`);
            break;
          }
        } else {
          console.log(`[Image] Aucun résultat Unsplash pour "${query}" (${searchRes.status}), essai suivant...`);
        }
      } catch (e: any) {
        console.warn(`[Image] Échec requête Unsplash (${query}) : ${e.message}`);
      }
    }
  } else {
    console.warn(`⚠️ UNSPLASH_ACCESS_KEY non trouvée dans l'environnement.`);
  }

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (err: any) {
      console.log(`[Image] Erreur de téléchargement image, nouvel essai... (Restant: ${retries - 1})`);
      retries--;
      if (retries === 0) throw err;
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  throw new Error("Failed to generate image after retries.");
}

const DANGLING_WORDS = new Set([
  'À', 'A', 'DE', 'DU', 'DES', 'EN', 'AU', 'AUX', 'DANS',
  'POUR', 'SUR', 'ET', 'OU', 'PAR', 'AVEC', 'LE', 'LA', 'LES', 'UN', 'UNE',
  'AL', 'EL', 'D\'', 'L\'', ':', '-'
]);

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function measureTextExact(text: string, fontSize: number): Promise<number> {
  const safeText = escapeXml(text);
  const svg = `
  <svg width="1200" height="150" xmlns="http://www.w3.org/2000/svg">
    <text x="30" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="${fontSize}px" fill="#000000">${safeText}</text>
  </svg>
  `;
  try {
    const { info } = await sharp(Buffer.from(svg)).trim().toBuffer({ resolveWithObject: true });
    return info.width;
  } catch (e) {
    return text.length * fontSize * 0.72;
  }
}

async function formatTitleBadgesExact(title: string, maxAvailableWidth: number = 920): Promise<{ lines: string[], fontSize: number, measuredWidths: number[] }> {
  const cleanTitle = title.toUpperCase().replace(/\s+/g, ' ').trim();
  const words = cleanTitle.split(' ');

  let fontSize = 44;
  let bestLines: string[] = [];

  if (words.length <= 2) {
    let w = await measureTextExact(cleanTitle, fontSize);
    while (w + 80 > maxAvailableWidth && fontSize > 28) {
      fontSize -= 2;
      w = await measureTextExact(cleanTitle, fontSize);
    }
    return { lines: [cleanTitle], fontSize, measuredWidths: [w] };
  }

  let minDiff = Infinity;
  let chosenSplit = 1;

  for (let i = 1; i < words.length; i++) {
    const line1 = words.slice(0, i).join(' ');
    const line2 = words.slice(i).join(' ');
    const lastWord = words[i - 1];
    const penalty = DANGLING_WORDS.has(lastWord) ? 250 : 0;

    const w1 = await measureTextExact(line1, fontSize);
    const w2 = await measureTextExact(line2, fontSize);

    const diff = Math.abs(w1 - w2) + penalty;
    if (w1 + 80 <= maxAvailableWidth && w2 + 80 <= maxAvailableWidth) {
      if (diff < minDiff) {
        minDiff = diff;
        chosenSplit = i;
      }
    }
  }

  bestLines = [
    words.slice(0, chosenSplit).join(' '),
    words.slice(chosenSplit).join(' ')
  ];

  let w1 = await measureTextExact(bestLines[0], fontSize);
  let w2 = await measureTextExact(bestLines[1], fontSize);

  while ((w1 + 80 > maxAvailableWidth || w2 + 80 > maxAvailableWidth) && fontSize > 28) {
    fontSize -= 2;
    w1 = await measureTextExact(bestLines[0], fontSize);
    w2 = await measureTextExact(bestLines[1], fontSize);
  }

  return { lines: bestLines, fontSize, measuredWidths: [w1, w2] };
}

/**
 * 2. Overlay Branding Lqaly (Badges Titre en bas: Blanc ligne 1, Rouge ligne 2)
 */
async function createLqalyBrandingSvg(title: string, category: string): Promise<Buffer> {
  const maxAvailableWidth = 920;
  const { lines, fontSize, measuredWidths } = await formatTitleBadgesExact(title, maxAvailableWidth);

  const paddingX = 36;
  const badgeHeight = Math.round(fontSize * 1.65);
  const badgeSpacing = 14;
  const rx = 8;
  const startX = 80;

  const totalBadgesHeight = lines.length * badgeHeight + (lines.length - 1) * badgeSpacing;
  const endY = 1200;
  const startY = endY - totalBadgesHeight;

  let badgesSvg = '';

  lines.forEach((lineText, index) => {
    const textWidth = measuredWidths[index];
    const boxWidth = Math.min(maxAvailableWidth, Math.ceil(textWidth) + paddingX * 2);
    const boxY = startY + index * (badgeHeight + badgeSpacing);
    const textY = Math.round(boxY + badgeHeight * 0.68);
    const textCenterX = Math.round(startX + boxWidth / 2);

    // Ligne 1: Fond Blanc, Texte Sombre
    // Ligne 2: Fond Rouge, Texte Blanc
    const isRed = index % 2 === 1;
    const bgColor = isRed ? '#DC2626' : '#FFFFFF';
    const textColor = isRed ? '#FFFFFF' : '#0F172A';

    badgesSvg += `
      <!-- Badge Ligne ${index + 1} -->
      <g filter="url(#badge-shadow)">
        <rect x="${startX}" y="${boxY}" width="${boxWidth}" height="${badgeHeight}" rx="${rx}" fill="${bgColor}" />
        <text x="${textCenterX}" y="${textY}" text-anchor="middle" class="badge-text" font-size="${fontSize}px" fill="${textColor}">${escapeXml(lineText)}</text>
      </g>
    `;
  });

  const categoryLabel = (category || 'Guide Immo').toUpperCase();

  const svg = `
  <svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Dégradé sombre en bas pour garantir un contraste optimal -->
      <linearGradient id="bottom-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0" />
        <stop offset="35%" stop-color="#000000" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.78" />
      </linearGradient>

      <!-- Ombre portée douce pour les badges -->
      <filter id="badge-shadow" x="-5%" y="-15%" width="120%" height="140%">
        <feDropShadow dx="0" dy="5" stdDeviation="8" flood-color="#000000" flood-opacity="0.30" />
      </filter>
    </defs>

    <style>
      .badge-text { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
        font-weight: 800; 
        letter-spacing: 0.5px; 
      }
      .footer-brand { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
        font-weight: 700; 
        font-size: 26px; 
        fill: #FFFFFF; 
        letter-spacing: 0.5px; 
      }
      .footer-tag { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
        font-weight: 700; 
        font-size: 22px; 
        fill: #F1F5F9; 
        letter-spacing: 1.5px; 
      }
    </style>

    <!-- Fond protecteur Logo (Carte blanche avec ombre) -->
    <g filter="url(#badge-shadow)">
      <rect x="80" y="65" width="320" height="84" rx="14" fill="#FFFFFF" />
    </g>

    <!-- Vignette / Dégradé sombre inférieur -->
    <rect x="0" y="680" width="1080" height="670" fill="url(#bottom-gradient)" />

    <!-- Badges Titre -->
    ${badgesSvg}

    <!-- Barre Inférieure Footer -->
    <g transform="translate(80, 1260)">
      <text x="0" y="24" class="footer-brand">www.lqaly.com</text>
      <text x="920" y="24" text-anchor="end" class="footer-tag">${escapeXml(categoryLabel)}</text>
    </g>
  </svg>
  `;
  return Buffer.from(svg);
}

/**
 * 3. Assemblage final en image HD prête pour le blog
 */
async function generateAutoLqalyCover(data: ArticleData): Promise<{ buffer: Buffer }> {
  console.log(`🖼️ [Auto-Image] Génération gratuite pour : ${data.permalinkSlug}`);

  // 1. Récupération de l'image du sujet via Unsplash
  const baseAiBuffer = await generateRealEstateSubject(data.primaryKeyword, data.metaTitle);

  // 2. Redimensionnement (Format vertical 4:5 idéal pour social/blog)
  const resizedBase = await sharp(baseAiBuffer)
    .resize(1080, 1350, { fit: 'cover', position: 'bottom' })
    .toBuffer();

  // 3. Fusion avec le Branding SVG et le logo officiel paysage
  const brandingOverlay = await createLqalyBrandingSvg(data.metaTitle, data.category);

  const logoCandidates = [
    path.join(__dirname, '../public/landscape-logo.png'),
    path.resolve(process.cwd(), 'public/landscape-logo.png'),
    path.resolve(process.cwd(), 'frontend/public/landscape-logo.png')
  ];
  const logoPath = logoCandidates.find(p => fs.existsSync(p)) || logoCandidates[0];

  const logoWidth = 270;
  const logoHeight = Math.round(logoWidth * (520 / 2502)); // ~56px
  const logoLeft = Math.round(80 + (320 - logoWidth) / 2); // 105px
  const logoTop = Math.round(65 + (84 - logoHeight) / 2); // 79px

  const logoBuffer = await sharp(logoPath)
    .resize(logoWidth)
    .toBuffer();

  const finalImage = await sharp(resizedBase)
    .composite([
      { input: brandingOverlay, top: 0, left: 0 },
      { input: logoBuffer, top: logoTop, left: logoLeft }
    ])
    .jpeg({ quality: 92 })
    .toBuffer();

  // Enregistrement local automatique dans public/images/blog
  const blogImagesDirs = [
    path.resolve(process.cwd(), 'frontend/public/images/blog'),
    path.resolve(process.cwd(), 'public/images/blog'),
    path.resolve(__dirname, '../public/images/blog')
  ];
  const targetImagesDir = blogImagesDirs.find(d => fs.existsSync(d)) || blogImagesDirs[0];
  if (!fs.existsSync(targetImagesDir)) {
    fs.mkdirSync(targetImagesDir, { recursive: true });
  }
  const localFilePath = path.join(targetImagesDir, `${data.permalinkSlug}.jpg`);
  fs.writeFileSync(localFilePath, finalImage);
  console.log(`💾 Image enregistrée localement : ${localFilePath}`);

  return { buffer: finalImage };
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
 * CLI helper: Regenerates cover images for specified article slugs or titles.
 */
async function regenerateImagesForArticles(targets: string[]) {
  console.log(`\n🎨 Régénération des couvertures pour : ${targets.join(', ')}`);

  const blogDirs = [
    path.resolve(process.cwd(), 'frontend/src/content/blog'),
    path.resolve(process.cwd(), 'src/content/blog'),
    path.resolve(__dirname, '../src/content/blog')
  ];
  const blogDir = blogDirs.find(d => fs.existsSync(d));
  if (!blogDir) {
    throw new Error("Dossier des articles blog (src/content/blog) introuvable.");
  }

  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

  for (const target of targets) {
    const cleanTarget = target.trim().toLowerCase();

    // Match file by slug or title
    let matchedFile: string | undefined;
    let fileContent = '';

    for (const file of files) {
      const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
      const slugMatch = content.match(/slug:\s*([^\r\n]+)/);
      const titleMatch = content.match(/title:\s*["']?([^"'\r\n]+)["']?/);
      const fileSlug = (slugMatch ? slugMatch[1].trim() : file.replace('.md', '')).toLowerCase();
      const fileTitle = (titleMatch ? titleMatch[1].trim() : '').toLowerCase();

      if (
        file.toLowerCase().includes(cleanTarget) ||
        fileSlug === cleanTarget ||
        fileTitle.includes(cleanTarget) ||
        cleanTarget.includes(fileSlug) ||
        cleanTarget.includes(fileTitle)
      ) {
        matchedFile = file;
        fileContent = content;
        break;
      }
    }

    if (!matchedFile) {
      console.warn(`⚠️ Article non trouvé pour la cible : "${target}"`);
      continue;
    }

    const titleMatch = fileContent.match(/title:\s*["']?([^"'\r\n]+)["']?/);
    const categoryMatch = fileContent.match(/category:\s*([^\r\n]+)/);
    const slugMatch = fileContent.match(/slug:\s*([^\r\n]+)/);

    const title = titleMatch ? titleMatch[1].trim() : target;
    const category = categoryMatch ? categoryMatch[1].trim() : 'Conseils Pratiques';
    const slug = slugMatch ? slugMatch[1].trim() : matchedFile.replace('.md', '');

    const articleData: ArticleData = {
      metaTitle: title,
      metaDescription: '',
      primaryKeyword: title,
      secondaryKeywords: '',
      permalinkSlug: slug,
      internalLinks: '',
      externalLinks: '',
      keywordStrategy: '',
      contentGaps: '',
      contentStructure: '',
      imagePrompt: '',
      category: category,
    };

    console.log(`\n========================================`);
    console.log(`📸 Génération couverture : "${title}" (${slug})`);
    console.log(`========================================`);

    const { buffer } = await generateAutoLqalyCover(articleData);

    // Commit to GitHub if configured
    if (config.githubToken && config.githubOwner && config.githubRepo) {
      if (!octokit) {
        octokit = new Octokit({ auth: config.githubToken });
      }
      try {
        await commitImageToGithub(slug, buffer);
      } catch (err: any) {
        console.warn(`⚠️ Octokit push warning : ${err.message}`);
      }
    }

    console.log(`✨ Couverture mise à jour pour : ${slug}`);
  }
}

/**
 * Main execution pipeline
 */
async function main() {
  console.log("🚀 Lancement de auto-blogger.ts...", process.argv.slice(2));
  const args = process.argv.slice(2);
  const imageOnlyIndex = args.findIndex(a => a === '--image-only' || a === '--image' || a === '--regenerate-image');

  if (imageOnlyIndex !== -1) {
    const targets = args.slice(imageOnlyIndex + 1).filter(a => !a.startsWith('--'));
    if (targets.length === 0) {
      console.error("Veuillez spécifier au moins un slug ou titre après --image-only");
      process.exit(1);
    }
    await regenerateImagesForArticles(targets);
    return;
  }

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

          try {
            const { buffer } = await generateAutoLqalyCover(seoData);
            await commitImageToGithub(slug, buffer);
          } catch (imgError: any) {
            console.error(`❌ Failed to generate/commit image:`, imgError.message);
          }

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
