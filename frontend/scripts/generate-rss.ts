import fs from 'fs';
import path from 'path';

// Fix for __dirname in ESM
const __dirname = path.resolve();

function generateRss() {
  console.log("📝 Generating RSS feed...");
  const postsDir = path.resolve(__dirname, 'src/content/blog');
  
  if (!fs.existsSync(postsDir)) {
    console.warn(`Directory not found: ${postsDir}`);
    return;
  }
  
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  let itemsXml = '';
  const now = new Date().toUTCString();

  files.forEach(file => {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return;
    
    const lines = frontmatterMatch[1].split('\n');
    let title = '', description = '', slug = '', isoDate = 0;
    
    lines.forEach(line => {
      const titleMatch = line.match(/^title:\s*"(.*?)"/);
      if (titleMatch) title = titleMatch[1];
      
      const descMatch = line.match(/^description:\s*"(.*?)"/);
      if (descMatch) description = descMatch[1];
      
      const slugMatch = line.match(/^slug:\s*(.*)/);
      if (slugMatch) slug = slugMatch[1].trim();
      
      const isoMatch = line.match(/^isoDate:\s*(.*)/);
      if (isoMatch) isoDate = parseInt(isoMatch[1].trim());
    });
    
    if (!title || !slug) return;

    const pubDate = new Date(isoDate || Date.now()).toUTCString();
    const link = `https://lqaly.com/blog/${slug}`;
    
    itemsXml += `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid>${link}</guid>
    </item>`;
  });

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Lqaly Immobilier Blog</title>
    <link>https://lqaly.com</link>
    <description>Guide et tendances de l'immobilier au Maroc</description>
    <language>fr</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="https://lqaly.com/feed.xml" rel="self" type="application/rss+xml" />${itemsXml}
  </channel>
</rss>`;

  const publicDir = path.resolve(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Create standard XML feed
  fs.writeFileSync(path.join(publicDir, 'feed.xml'), rssFeed);
  
  // Create extensionless feed file so that /feed works on some static hosts
  fs.writeFileSync(path.join(publicDir, 'feed'), rssFeed);
  
  console.log("✅ RSS feed successfully generated at public/feed.xml and public/feed");
}

generateRss();
