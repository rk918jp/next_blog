import {useEffect, useState} from "react";
import * as runtime from "react/jsx-runtime";
import {evaluate, nodeTypes} from "@mdx-js/mdx";
import * as provider from "@mdx-js/react";
import {toc} from "rehype-toc";
import {visit} from "unist-util-visit";
import {useMDXComponents} from "@mdx-js/react";

/**
 * MDX文字列をコンポーネントに変換するカスタムフック
 * MDX内で使用出来るReactコンポーネントは、必ずMDXProviderで指定が必要
 * @param content
 * @return {*}
 */
export const useMDX = (content) => {
  const [exports, setExports] = useState({ default: runtime.Fragment });
  // MDXProviderで指定したコンポーネントの一覧を取得
  const mdxComponents = useMDXComponents();

  useEffect(() => {
    evaluate(content, {
      ...provider,
      ...runtime,
      remarkPlugins: [],
      rehypePlugins: [
        [
          toc,
          {
            passThrough: nodeTypes,
            headings: ["h1", "h2"],
          }
        ],
        // mdxComponentsで定義されていないコンポーネントを記述した際はnullに置き換える(Fragmentに変換される)
        () => (tree) => {
          visit(tree, "mdxJsxFlowElement", (node) => {
            if (!(node.name in mdxComponents)) {
              node.name = null;
            }
          });
        }
      ],
    })
      .then((exports) => {
        setExports(exports);
      })
      .catch((e) => {
        // NOTE: Do nothing
      })
  }, [content]);

  return exports?.default;
}