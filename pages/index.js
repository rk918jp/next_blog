import React from "react";
import {MainLayout} from "../components/MainLayout";
import {getPostsByCategory} from "../util/mdxUtil";
import {postCategoryDef} from "../definitions/postDefinitions";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Snackbar,
  Typography
} from "@mui/material";
import Link from "next/link";
import moment from "moment";
import axios from "axios";

const Home = ({categories}) => {
  const [deletePost, setDeletePost] = React.useState();
  const [message, setMessage] = React.useState();

  const handleRemovePost = (post) => {
    axios.post("/api/deletePost", {
      category: post.category,
      slug: post.slug,
    }).then((res) => {
      setDeletePost();
      setMessage({
        value: "Success",
        severity: "success",
      });

      // TODO: 一覧のリフレッシュ
    });
  };

  return (
    <MainLayout>
      <Snackbar
        anchorOrigin={{vertical: "top", horizontal: "center"}}
        autoHideDuration={1000}
        open={message}
        onClose={() => setMessage(undefined)}
      >
        {message && (
          <Alert severity={message.severity}>{message.value}</Alert>
        )}
      </Snackbar>
      {categories.map((category) => (
        <Container sx={{mb: 5}} key={category.value}>
          <Typography variant={"h2"} sx={{fontSize: 30}}>
            {category.label}
          </Typography>
          <Divider sx={{mt: 1, mb: 3}}/>
          {category.posts.length ? (
            <>
              {category.posts.map((post) => (
                <Link href={post.path} key={post.path}>
                  <Card sx={{my: 2}}>
                    <CardHeader
                      title={post.metadata.title}
                      titleTypographyProps={{
                        variant: "h5"
                      }}
                      subheader={moment(post.metadata.publishedAt).format("YYYY/MM/DD HH:mm")}
                      subheaderTypographyProps={{
                        variant: "subtitle2",
                      }}
                      action={
                        <>
                          <Link href={`${post.path}/edit`}>
                            <Button size={"small"}>Edit</Button>
                          </Link>
                          <Button
                            size={"small"}
                            color={"error"}
                            onClick={(e) => {
                              setDeletePost(post);
                              e.preventDefault();
                            }}
                          >Delete</Button>
                        </>
                      }
                    />
                  </Card>
                </Link>
              ))}
            </>
          ) : (
            <Typography>Not Found</Typography>
          )}

        </Container>
      ))}
      <Dialog open={deletePost}>
        <DialogTitle>
          Remove post
        </DialogTitle>
        <DialogContent>
          You are about to delete post <span style={{backgroundColor: "#eee"}}>{deletePost?.path}</span>.
          <br/>
          Are you sure?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDeletePost();
          }}>Cancel</Button>
          <Button onClick={() => handleRemovePost(deletePost)} color={"error"}>Delete</Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  )
}

export async function getStaticProps(context) {
  const postsByCategory = await Promise.all(postCategoryDef.map((category) => {
    return getPostsByCategory(category.value);
  }));

  return {
    props: {
      categories: postCategoryDef.map((category, idx) => ({
        ...category,
        posts: postsByCategory[idx],
      })),
    },
  };
}

export default Home;