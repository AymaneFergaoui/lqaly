import { BlogPost, parseMarkdown } from '../utils/markdownParser';

// Use Vite's glob import to get all markdown files as raw strings
const markdownFiles = import.meta.glob('../content/blog/*.md', { as: 'raw', eager: true });

export function getAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];
  
  for (const path in markdownFiles) {
    const rawContent = markdownFiles[path] as string;
    const post = parseMarkdown(rawContent);
    posts.push(post);
  }

  // Sort by date descending
  return posts.sort((a, b) => b.meta.isoDate - a.meta.isoDate);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find(post => post.meta.slug === slug);
}
