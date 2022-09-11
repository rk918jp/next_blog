const withTM = require('next-transpile-modules')([
  '@uiw/react-md-editor',
  '@uiw/react-markdown-preview',
]);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    exmExternals: "loose",
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
