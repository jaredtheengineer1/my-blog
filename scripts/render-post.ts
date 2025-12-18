import { mkdir, readFile, writeFile } from 'fs/promises';
import matter from 'gray-matter';
import { marked } from 'marked';
import { basename, join } from 'path';

interface PostMetadata {
  title: string;
  date: string;
  tags?: string[];
  description?: string;
}

interface Post extends PostMetadata {
  content: string;
  slug: string;
  html: string;
}

export async function renderPost(markdownPath: string): Promise<Post> {
  const markdown = await readFile(markdownPath, 'utf-8');

  const dateRegexTrailingDash = /^(\d{4}-\d{2}-\d{2})-/;

  const { data, content } = matter(markdown);
  const metadata = data as PostMetadata;

  const html = await marked(content);

  const filename = basename(markdownPath);
  const slug = filename.replace(dateRegexTrailingDash, '').replace(/\.md$/, '');
  console.log('slug: ', slug);
  // metadata.date = metadata.date.toString().slice(0, 10);
  const isoDate = new Date(metadata.date).toISOString().slice(0, 10);
  console.log(
    'metadata: ',
    isoDate,
    `${isoDate.slice(5, 7)}/${isoDate.slice(8)}/${isoDate.slice(0, 4)}`
  );
  metadata.date = `${isoDate.slice(5, 7)}/${isoDate.slice(8)}/${isoDate.slice(0, 4)}`;
  return {
    ...metadata,
    content,
    slug,
    html,
  };
}

export async function renderPostToFile(
  markdownPath: string,
  templatePath: string,
  outputDir: string
): Promise<void> {
  const post = await renderPost(markdownPath);
  const template = await readFile(templatePath, 'utf-8');

  console.log('what post: ', post);
  // Replace template placeholders
  const html = template
    .replaceAll('{{title}}', post.title)
    .replaceAll('{{date}}', post.date)
    .replaceAll('{{content}}', post.html);

  // Write to output directory
  await mkdir(join(outputDir, 'posts'), { recursive: true });
  const outputPath = join(outputDir, 'posts', `${post.slug}.html`);
  await writeFile(outputPath, html);

  console.log(`✅ Rendered: ${post.slug}.html`);
}
