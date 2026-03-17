export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function readingTime(text: string): string {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function getUniqueTagsFromPosts(posts: any[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.data.tags?.forEach((tag: string) => tags.add(tag));
  });
  return [...tags].sort();
}

export const SITE = {
  title: 'Alex Chen | Developer',
  description: 'Full-stack developer specializing in React, TypeScript, and cloud-native applications.',
  author: 'Alex Chen',
  url: 'https://devportfolio.pages.dev',
  ogImage: '/og/default.png',
  postsPerPage: 6,
};
