import React from "react";
import {MainLayout} from "../components/MainLayout";
import {
  Alert,
  Button,
  Card,
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
import useSWR from "swr";
import {fetcher} from "../util/fetcher";

const Home = () => {
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

  const {data, loading, error} = useSWR("/api/getPostsByCategory", fetcher);

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
      {data.data.map((category) => (
        <Container sx={{mb: 5}} key={category.value}>
          <Typography variant={"h2"} sx={{fontSize: 30}}>
            {category.label}
          </Typography>
          <Divider sx={{mt: 1, mb: 3}}/>
          {category.posts.length ? (
            <>
              {category.posts.map((post) => (
                <Link href={`/${category.id}/${post.slug}`} key={`/${category}/${post.slug}`}>
                  <Card sx={{my: 2}}>
                    <CardHeader
                      title={post.title}
                      titleTypographyProps={{
                        variant: "h5"
                      }}
                      subheader={moment(post.publishedAt).format("YYYY/MM/DD HH:mm")}
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
      <Dialog open={deletePost ?? false}>
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

export default Home;