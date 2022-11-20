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
import {MDXProvider} from '@mdx-js/react'
import {useMDX} from "../../../hooks/useMDX";


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
    <MDXProvider components={availableMdxComponents}>
      <Post />
    </MDXProvider>
  )
}

export default PostPage;