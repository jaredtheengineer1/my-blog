import { copyFile, mkdir, readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { renderPost, renderPostToFile } from './render-post';

const POSTS_DIR = './src/posts';
const TEMPLATES_DIR = './src/templates';
const OUTPUT_DIR = './dist';
const ASSETS_DIR = './src/assets';

async function copyDirectory(src: string, dest: string): Promise<void> {
  await mkdir(dest, { recursive: true });
  const files = await readdir(src, { withFileTypes: true });

  for (const file of files) {
    const srcPath = join(src, file.name);
    const destPath = join(dest, file.name);

    if (file.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

async function buildBlog(): Promise<void> {
  console.log('🚀 Building blog...\n');

  // 1. Clean and create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });

  // 2. Copy assets (CSS, images)
  console.log('📦 Copying assets...');
  await copyDirectory(ASSETS_DIR, join(OUTPUT_DIR, 'assets'));

  // 3. Get all markdown files
  const postFiles = (await readdir(POSTS_DIR))
    .filter((file) => file.endsWith('.md'))
    .map((file) => join(POSTS_DIR, file));

  console.log(`\n📝 Found ${postFiles.length} posts\n`);

  // 4. Render all posts
  const posts = [];
  for (const postPath of postFiles) {
    const post = await renderPost(postPath);
    posts.push(post);

    // Render to HTML file
    await renderPostToFile(postPath, join(TEMPLATES_DIR, 'post.html'), OUTPUT_DIR);
  }
  // 5. Sort posts by date (newest first)
  // posts.sort((a, b) => b.date.localeCompare(a.date));
  posts.sort((a, b) => (b.date > a.date ? -1 : 1));

  // 6. Generate index page
  console.log('\n🏠 Generating index page...');
  const indexTemplate = await readFile(join(TEMPLATES_DIR, 'index.html'), 'utf-8');
  // Generate post list HTML
  //main
  //case-study-section = blog-preview-section
  //case-study-preview = blog-preview
  const postListHtml = posts.map(
    (post) => `
    <main> 
      <section class="blog-preview-section">
        <div class="blog-preview">
          <h2><a href="./posts/${post.slug}.html">${post.title}</a></h2>
          <time datetime=${post.date}">${post.date}</time>
          <p>${post.description}</p>
        </div>
      </section>
    </main>
    `
  );

  const indexHtml = indexTemplate.replace('{{posts}}', postListHtml);
  await writeFile(join(OUTPUT_DIR, 'index.html'), indexHtml);

  console.log('\n✨ Build complete!\n');
  console.log(`📂 Output: ${OUTPUT_DIR}/`);
  console.log(`📄 ${posts.length} posts rendered`);
  console.log(`🌐 Ready to deploy to GitHub Pages\n`);
}

buildBlog().catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
