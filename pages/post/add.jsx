import React from "react";
import {MainLayout} from "../../components/MainLayout";
import {useRouter} from "next/router";
import {MDXEditor} from "../../components/MDXEditor";

const PostAddPage = (props) => {
  const router = useRouter();

  return (
    <MainLayout>
      <MDXEditor
        onSubmit={(post) => {
          router.push(`/${post.category}/${post.slug}`);
        }}
      />
    </MainLayout>
  )
}

export default PostAddPage;