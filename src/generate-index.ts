import { readdir } from 'fs/promises';
import { join } from 'path';

interface BlogPost {
  filename: string;
  title: string;
  date: string;
}

async function generateIndex(postsDir: string): Promise<BlogPost[]> {
  const files = await readdir(postsDir);
  const mdFiles = files.filter((f) => f.endsWith('.md'));
  const dateRegex = /^(\d{4}-\d{2}-\d{2})/;
  const dateRegexTrailingDash = /^(\d{4}-\d{2}-\d{2})-/;

  return mdFiles.map((filename) => ({
    filename,
    title: filename.replace(dateRegexTrailingDash, '').replace('.md', ''),
    date: filename.match(dateRegex)?.[1] || '',
  }));
}
const posts = await generateIndex('../posts');
console.log(JSON.stringify(posts, null, 2));
