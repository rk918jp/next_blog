import {Alert, Button, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, TextField} from "@mui/material";
import {DateTimePicker} from "@mui/x-date-pickers";
import MarkDown from "markdown-to-jsx";
import {availableMdxComponents} from "../../definitions/availableMdxComponents";
import React from "react";
import axios from "axios";
import moment from "moment/moment";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import useSWR from "swr";
import {fetcher} from "../../util/fetcher";
import {useMDX} from "../../hooks/useMDX";
import {MDXProvider} from "@mdx-js/react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  {ssr: false}
)

const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  {ssr: false}
)

const Preview = ({source}) => {
  const Content = useMDX(source);
  return (
    <MDXProvider components={availableMdxComponents}>
      <Content />
    </MDXProvider>
  )
}

export const MDXEditor = ({
  defaultValue,
  onSubmit,
}) => {
  const [content, setContent] = React.useState();
  const [title, setTitle] = React.useState();
  const [slug, setSlug] = React.useState();
  const [category, setCategory] = React.useState();
  const [message, setMessage] = React.useState();
  const [publishedAt, setPublishedAt] = React.useState();

  const handleClickSave = async () => {
    try {
      const res = await axios.post("/api/createPost", {
        content,
        metadata: {
          title,
          category,
          slug,
          publishedAt: (publishedAt ?? moment()).toDate(),
        },
      });
      setMessage({
        value: "Success",
        severity: "success",
      });
      if (onSubmit) {
        onSubmit({
          content,
          title,
          category,
          slug,
          publishedAt: (publishedAt ?? moment()).toDate(),
        });
      }

    } catch (e) {
      setMessage({
        value: "Error",
        severity: "error",
      });
    }
  }

  const {data: catData, loading: loadingCat, error} = useSWR("/api/getCategories", fetcher);

  return (
    <>
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
      <Grid sx={{mb: 2}}>
        <Grid sx={{display: "flex", justifyContent: "flex-end", mb: 2}}>
          <Button variant={"contained"} onClick={handleClickSave}>Save</Button>
        </Grid>
        <TextField
          id="title"
          label="Title"
          fullWidth
          style={{marginBottom: 10}}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Grid container spacing={1}>
          <Grid item sm={6}>
            <FormControl fullWidth>
              <InputLabel id="category-label" required>Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
                fullWidth
                required
              >
                {catData?.data?.map((category) => (
                  <MenuItem value={category.id} key={category.id}>{category.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={6}>
            <TextField
              id="slug"
              label="Slug"
              fullWidth
              style={{marginBottom: 10}}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item sm={6}>
            <DateTimePicker
              label={"Published at"}
              onChange={setPublishedAt}
              value={publishedAt}
              renderInput={(props) => <TextField {...props} fullWidth/>}
              ampm={false}
            />
          </Grid>
        </Grid>
      </Grid>
      <div data-color-mode="light">
        <div className="wmde-markdown-var"/>
        <MDEditor
          value={content}
          onChange={setContent}
          height={200}
          components={{
            preview: (source) => <Preview source={source} />
          }}
        />
      </div>
    </>
  )
}