const path = require("path");
const withTM = require('next-transpile-modules')([
  '@uiw/react-md-editor',
  '@uiw/react-markdown-preview',
]);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: "loose",
  },
  webpack: (config) => {
    config.resolve.alias.yjs = path.resolve("node_modules/yjs/dist/yjs.cjs");
    return config;
  }
}


const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

module.exports = withMDX(withTM(nextConfig));
