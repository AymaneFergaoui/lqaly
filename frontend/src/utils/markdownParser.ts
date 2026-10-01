export interface BlogPostMeta {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  isoDate: number;
  description: string;
  coverImage: string;
}

export interface BlogPost {
  meta: BlogPostMeta;
  content: string;
}

export function parseMarkdown(rawContent: string): BlogPost {
  const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.match(frontMatterRegex);

  if (!match) {
    return {
      meta: {
        id: '', slug: '', title: 'Untitled', category: '', author: '',
        date: '', readTime: '', isoDate: 0, description: '', coverImage: ''
      },
      content: rawContent
    };
  }

  const frontMatterString = match[1];
  const content = match[2];

  const meta: Partial<BlogPostMeta> = {};
  const lines = frontMatterString.split('\n');

  lines.forEach(line => {
    const splitIndex = line.indexOf(':');
    if (splitIndex > -1) {
      const key = line.slice(0, splitIndex).trim() as keyof BlogPostMeta;
      let value = line.slice(splitIndex + 1).trim();
      
      // Remove surrounding quotes if they exist
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Unescape quotes
      value = value.replace(/\\"/g, '"');

      if (key === 'isoDate') {
        (meta as any)[key] = Number(value);
      } else {
        (meta as any)[key] = value;
      }
    }
  });

  return {
    meta: meta as BlogPostMeta,
    content: content.trim()
  };
}
