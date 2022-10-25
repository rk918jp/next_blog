import React from "react";
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
import MarkDown from "markdown-to-jsx";
import {availableMdxComponents} from "../../../definitions/availableMdxComponents";

const PostPage = () => {
  const router = useRouter();
  const {category, slug} = router.query;

  const {data, loading, error} = useSWR(
    category && slug ? ["/api/getPost", {category, slug}] : undefined,
    fetcher
  );

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
            <MarkDown
              options={{
                overrides: availableMdxComponents,
              }}
            >
              {data.data.body}
            </MarkDown>
          </>
        )}
      </Paper>
    </MainLayout>
  )
}

export default PostPage;