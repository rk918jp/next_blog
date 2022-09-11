import {MainLayout} from "../components/MainLayout";
import {getPostsByCategory} from "../util/mdxUtil";
import {postCategoryDef} from "../definitions/postDefinitions";
import {Card, CardContent, Container, Divider, Typography} from "@mui/material";
import Link from "next/link";

const Home = ({categories}) => {
  return (
    <MainLayout>
      {categories.map((category) => (
        <Container>
          <Typography variant={"h2"} sx={{fontSize: 30}}>
            {category.label}
          </Typography>
          <Divider sx={{my: 1}}/>
          {category.posts.length ? (
            <>
              {category.posts.map((post) => (
                <Link href={post.path} key={post.path}>
                  <Card sx={{my: 2}}>
                    <CardContent>
                      <Typography variant={"h5"}>
                        {post.metadata.title}
                      </Typography>

                    </CardContent>
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