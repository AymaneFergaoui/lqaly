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

/**
 * Agent 1: Generates SEO data (JSON) based on an RSS feed item.
 */
async function analyzeArticleSEO(feedItem: any): Promise<ArticleData> {
  console.log(`🕵️ [Agent 1] Analyzing article and generating SEO Data: "${feedItem.title}"...`);

  let sourceSummary = feedItem.contentSnippet || feedItem.content || "No summary provided.";
  if (sourceSummary.trim().toLowerCase() === 'comments') {
    sourceSummary = "No summary provided.";
  }

  const prompt = `
You are an expert SEO Manager and Content Strategist specializing in Real Estate. Your goal is to analyze the source article and generate a highly optimized SEO strategy in French for writing a new, original article for Lqaly, a premium Moroccan real estate platform.

Source Title: ${feedItem.title}
Source Content Summary: ${sourceSummary}
Source URL: ${feedItem.link}

You MUST output a valid JSON object with the following fields (the JSON keys must remain in English, but all content values MUST be in French):
- "metaTitle": An improved, engaging title for the new article (max 60 chars).
- "metaDescription": A compelling SEO meta description (150-160 chars).
- "primaryKeyword": The single best primary keyword for this topic.
- "secondaryKeywords": A comma-separated list of 3-5 LSI/secondary keywords.
- "permalinkSlug": A URL-friendly kebab-case string based on the primary keyword.
- "internalLinks": A comma-separated list of 3 hypothetical internal URLs starting with 'https://lqaly.com/' related to this topic.
- "externalLinks": A comma-separated list of 3 authoritative external URLs (e.g., reputable news sites or academic sources) related to this topic.
- "keywordStrategy": Instructions on how to use the keywords and semantic variations.
- "contentGaps": Identify what the source article missed that we should cover to provide unique value.
- "contentStructure": A brief outline of the H2 and H3 sections to be written.
- "imagePrompt": A prompt for an AI image generator to create a featured image for this article.
- "category": The most appropriate category for this article (e.g., "Immobilier", "Tendances du Marché", "Investissement", "Conseils Pratiques", "Luxe").
`;

  const response = await openai.chat.completions.create({
    model: "claude-sonnet-4.6",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });
  const text = response.choices[0].message?.content || '{}';

  try {
    const data = JSON.parse(text);
    return {
      metaTitle: data.metaTitle || data.title || '',
      metaDescription: data.metaDescription || data.description || '',
      primaryKeyword: data.primaryKeyword || data.keyword || '',
      secondaryKeywords: data.secondaryKeywords || data.keywords || '',
      permalinkSlug: data.permalinkSlug || data.slug || '',
      internalLinks: data.internalLinks || '',
      externalLinks: data.externalLinks || '',
      keywordStrategy: data.keywordStrategy || '',
      contentGaps: data.contentGaps || '',
      contentStructure: data.contentStructure || '',
      imagePrompt: data.imagePrompt || '',
      category: data.category || 'Immobilier'
    };
  } catch (error) {
    console.error("❌ Failed to parse SEO JSON from Gemini:", text);
    throw new Error("Invalid JSON generated by SEO Agent.");
  }
}

/**
 * Agent 2: Generates an SEO-optimized blog post using the generated SEO Data.
 */
async function generateArticle(data: ArticleData): Promise<string> {
  console.log(`🤖 [Agent 2] Writing content for: "${data.metaTitle}"...`);

  const prompt = `
You are an expert real estate journalist and content writer. You MUST write the entire article in French (Français) tailored for the Moroccan real estate market.

# INPUT DATA
- **Improved Title**: ${data.metaTitle}
- **Meta Description**: ${data.metaDescription}
- **Primary Keyword**: ${data.primaryKeyword}
- **Secondary Keywords**: ${data.secondaryKeywords}
- **Keyword Strategy**: ${data.keywordStrategy}
- **Content Gaps to Fill**: ${data.contentGaps}
- **Content Structure**: ${data.contentStructure}
- **Internal Links**: ${data.internalLinks}
- **External Links**: ${data.externalLinks}

# INPUT UTILIZATION RULES
- **Improved Title**: Defines the editorial framing and narrative direction. Use it to understand positioning, but do NOT output or restate the title in the body (except in the YAML frontmatter).
- **Primary Keyword**: Defines the main SEO focus and must guide topic relevance and terminology.
- **Keyword Strategy**: Must guide semantic variations, terminology choices, and topical emphasis throughout the article without keyword stuffing.
- **Content Structure**: The organizational backbone of the article. Progress logically through its points. Use \`##\` (H2) and \`###\` (H3) tags for main sections and subsections. Do NOT skip heading levels.
- **Content Gaps**: Must be addressed naturally by adding missing explanations, context, examples, or analysis where appropriate.
- **Internal and External Links**: Must be used EXACTLY as provided and follow all linking rules below.

# WRITING STYLE
- Open with a bold, specific claim or provocative statement relevant to real estate.
- Use an inverted pyramid: lead claim -> context -> detail -> examples -> implication.
- Write short, scannable paragraphs (2-4 sentences max).
- Build the argument naturally and end with a synthesis or implication, never abruptly on a quote.
- Tone must be neutral, journalistic, confident, and lightly analytical.
- Avoid hype, promotion, weak transitions, filler phrases, and unexplained jargon.
- Use "such as" instead of "like" in formal constructions.
- Define niche or emerging terms on first use.
- Keep pronoun perspective consistent.
- Quotes must advance the argument, not decorate it. Do not stack more than two quotes without a narrative beat. Introduce quotes with context, and paraphrase if too long or repetitive.

# SEO & READABILITY
- **Length**: Target between 800 and 1200 words. This is a comprehensive article.
- Integrate the primary keyword naturally within the first 1-2 sentences.
- Use formatting tags like \`**bold**\`, \`<ul>\` (bullet points), and \`<ol>\` (numbered lists) to break up the text and facilitate diagonal reading.
- At the very end of the article, you MUST integrate a FAQ section using the exact Schema.org HTML format:
<h2>FAQ sur [Topic]</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <h3 itemprop="name">[Question 1]</h3>
        <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
            <p itemprop="text">[Answer 1]</p>
        </div>
    </div>
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <h3 itemprop="name">[Question 2]</h3>
        <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
            <p itemprop="text">[Answer 2]</p>
        </div>
    </div>
</div>

# LINK DISTRIBUTION
- **Internal Links**: Use them naturally in the body. Format as Markdown: \`[descriptive anchor text](EXACT_URL_FROM_INPUT)\`.
- **External Links**: Use them to support facts, definitions, or statistics. Format as Markdown: \`[descriptive anchor text](EXACT_URL_FROM_INPUT)\`.
- Distribute links naturally across the full article. Place at least:
  - 1 link in the first 30%,
  - 1 in the middle,
  - 1 before the final paragraph (not in the conclusion).
- Never cluster multiple links in one paragraph. Maximum 1 link per paragraph. Links must feel fully integrated into the sentence.

# OUTPUT FORMAT (CRITICAL)
1. Your output MUST be strict raw Markdown. Do NOT wrap your output in markdown code blocks (e.g. \`\`\`markdown). Just output the raw text directly.
2. You MUST include YAML Frontmatter at the very top of the file, structured exactly like this:
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
3. Do not include any conversational intro or outro (e.g., "Here is your article:"). Start immediately with "---".
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
          // 1. Agent 1: Generate SEO Data
          const seoData = await analyzeArticleSEO(item);

          // Ensure critical fields are never empty before passing to Agent 2
          seoData.permalinkSlug = seoData.permalinkSlug || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `untitled-${Date.now()}`;
          seoData.metaTitle = seoData.metaTitle || item.title || 'Untitled Article';
          let fallbackDesc = item.contentSnippet || item.content || '';
          if (fallbackDesc.trim().toLowerCase() === 'comments' || fallbackDesc.trim() === '') {
            fallbackDesc = `Découvrez notre analyse détaillée sur : "${item.title}". Restez informé des dernières actualités et tendances de l'immobilier au Maroc avec Lqaly.`;
          }
          seoData.metaDescription = seoData.metaDescription && seoData.metaDescription.toLowerCase() !== 'comments' ? seoData.metaDescription : fallbackDesc;

          // 2. Agent 2: Write Article
          const markdownContent = await generateArticle(seoData);

          // 3. Commit Image and Markdown to GitHub
          const slug = seoData.permalinkSlug;

          try {
            const { buffer } = await downloadUnsplashImage(slug);
            await commitImageToGithub(slug, buffer);
          } catch (imgError: any) {
            console.error(`❌ Failed to download/commit image:`, imgError.message);
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
