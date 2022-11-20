import React, {useEffect, useState} from "react";
import {
  Divider,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import {MainLayout} from "../../../components/MainLayout";
import useSWR from "swr";
import {fetcher} from "../../../util/fetcher";
import {useRouter} from "next/router";
import {availableMdxComponents} from "../../../definitions/availableMdxComponents";
import * as provider from '@mdx-js/react'
import {evaluate, nodeTypes} from '@mdx-js/mdx'
import * as runtime from "react/jsx-runtime";
import rehypeRaw from "rehype-raw";
import {toc} from "rehype-toc";

/**
 * MDX文字列をコンポーネントに変換するカスタムフック
 * MDX内で使用出来るReactコンポーネントは、必ずMDXProviderで指定が必要
 * @param content
 * @return {*}
 */
const useMDX = (content) => {
  const [exports, setExports] = useState({ default: runtime.Fragment });
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
      ],
    })
      .then((exports) => {
        setExports(exports);
      })
  }, [content]);

  return exports?.default;
}


const Post = () => {
  const router = useRouter();
  const {category, slug} = router.query;

  const {data, loading, error} = useSWR(
    category && slug ? ["/api/getPost", {category, slug}] : undefined,
    fetcher
  );

  // DEBUG
  // const body = "## heading \n \n <div >red</div> \n \n <li></li> \n \n <Button>test</Button>";

  const Content = useMDX(data?.data?.body);

  return (
    <MainLayout>
      <Paper
        sx={{
          p: 2, display: 'flex', flexDirection: 'column'
        }}
      >
        {!data ? (
          <Skeleton />
        ) : (
          <>
            <Typography variant={"h1"} sx={{fontSize: 30, fontWeight: "600"}}>
              {data.data.title}
            </Typography>
            <Divider sx={{my: 1}}/>
            <Content/>
          </>
        )}
      </Paper>
    </MainLayout>
  )
}

const PostPage = () => {
  return (
    <provider.MDXProvider components={availableMdxComponents}>
      <Post />
    </provider.MDXProvider>
  )
}

export default PostPage;