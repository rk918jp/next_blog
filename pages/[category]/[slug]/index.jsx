import React from "react";
import {
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import {getPost, getPosts} from "../../../util/mdxUtil";
import {MainLayout} from "../../../components/MainLayout";

const PostPage = (props) => {
  const {category, slug, post} = props;
  const {metadata, content} = post;
  return (
    <MainLayout>
      <Paper
        sx={{
          p: 2, display: 'flex', flexDirection: 'column'
        }}
      >
        <Typography variant={"h1"} sx={{fontSize: 30, fontWeight: "600"}}>
          {metadata.title}
        </Typography>
        <Divider sx={{my: 1}} />
        <div dangerouslySetInnerHTML={{__html: post.content}} />
      </Paper>
    </MainLayout>
  )
}

export async function getStaticProps(context) {
  const {category, slug} = context.params;
  const post = await getPost(category, slug);
  return {
    props: {
      slug,
      category,
      post,
    },
  };
}

export async function getStaticPaths() {
  let allPosts = await getPosts();
  const paths = allPosts.map((post)=> ({
    params: {
      category: post.category,
      slug: post.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export default PostPage;