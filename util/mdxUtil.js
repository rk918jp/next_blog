import fs from "fs";
import recursive from "recursive-readdir";
import matter from "gray-matter";
import {remark} from "remark";
import remarkHtml from "remark-html";
import moment from "moment";

export const getPostsByCategory = async (category) => {
  const files = await recursive(`mdx-contents/${category}`);
  return files.map((path) => {
    const [category, slug] = path
      .replace("mdx-contents/", "")
      .replace(".mdx", "")
      .split("/");
    const file = fs.readFileSync(`mdx-contents/${category}/${slug}.mdx`);
    const {data: metadata} = matter(file);
    return {
      category,
      slug,
      metadata,
      path: `/${category}/${slug}`,
    };
  })
    .sort((a,b) => {
      return moment(a.metadata.publishedAt).isAfter(b.metadata.publishedAt) ? -1 : 1;
    });
};

export const getPosts = async () => {
  const files = await recursive(`mdx-contents`);
  return files.map((path) => {
    const [category, slug] = path
      .replace("mdx-contents/", "")
      .replace(".mdx", "")
      .split("/");
    const file = fs.readFileSync(`mdx-contents/${category}/${slug}.mdx`);
    const {data: metadata} = matter(file);
    return {
      category,
      slug,
      metadata,
      path: `/${category}/${slug}`,
    };
  })
    .sort((a,b) => {
      return moment(a.metadata.publishedAt).isAfter(b.metadata.publishedAt) ? -1 : 1;
    });
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
    contentMd: mdString,
  }
};

export const createPost = async (content, metadata) => {
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


export const updatePost = async (content, metadata) => {
  const mdxString = matter.stringify(content, metadata);
  const dirPath = `mdx-contents/${metadata.category}`
  const filePath = `${dirPath}/${metadata.slug}.mdx`;

  const dirExists = fs.existsSync(dirPath);
  if (!dirExists) {
    fs.mkdirSync(dirPath);
  }

  fs.writeFileSync(filePath, mdxString);
  return true;
}