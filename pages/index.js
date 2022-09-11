import {MainLayout} from "../components/MainLayout";
import {getPostsByCategory} from "../util/mdxUtil";
import {postCategoryDef} from "../definitions/postDefinitions";
import {Button, Card, CardActions, CardContent, CardHeader, Container, Divider, Typography} from "@mui/material";
import Link from "next/link";
import moment from "moment";

const Home = ({categories}) => {
  return (
    <MainLayout>
      {categories.map((category) => (
        <Container sx={{mb: 5}}>
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
                        <Button size={"small"}>Edit</Button>
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