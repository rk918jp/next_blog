import fs from "fs";
import matter from "gray-matter";
import {remark} from "remark";
import remarkHtml from "remark-html";

export const getPosts = async () => {
  const context = require.context("../mdx-contents/", true);
  const articles = [];
  for (const key of context.keys()) {
    const path = key.slice(2);
    const [category, slug] = path.replace(".mdx", "").split("/");
    const file = fs.readFileSync(`mdx-contents/${category}/${slug}.mdx`);
    const {data: metadata} = matter(file);
    articles.push({
      category,
      slug,
      metadata,
    });
  }
  return articles;
};

export const getPost = async (category, slug) => {
  const file = fs.readFileSync(`mdx-contents/${category}/${slug}.mdx`);
  const {data: metadata, content: mdString} = matter(file);
  const result = await remark()
    .use(remarkHtml)
    .process(mdString);
  return {
    metadata,
    content: result.toString(),
  }
};

export const savePost = async (content, metadata) => {
  const mdxString = matter.stringify(content, metadata);
  const dirPath = `mdx-contents/${metadata.category}`
  const filePath = `${dirPath}/${metadata.slug}.mdx`;

  const dirExists = fs.existsSync(dirPath);
  if (!dirExists) {
    fs.mkdirSync(dirPath);
  }

  const fileExists = fs.existsSync(filePath);
  if (fileExists) {
    throw new Error("Duplicate post");
  }

  fs.writeFileSync(filePath, mdxString);
  return true;
}