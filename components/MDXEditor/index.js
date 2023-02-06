import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import {DateTimePicker} from "@mui/x-date-pickers";
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
import {useDropzone} from "react-dropzone";

const defRangeFlag = [
  {
    value: 0,
    label: "非公開",
  },
  {
    value: 1,
    label: "公開範囲制限",
  },
  {
    value: 2,
    label: "全公開",
  },
];

const defPaidFlag = [
  {
    value: 1,
    label: "有料",
  },
  {
    value: 0,
    label: "無料",
  },
];

const defRestrictType = [
  {
    value: 1,
    label: "ユニット",
    codeKey: "will_unit_code",
  },
  {
    value: 2,
    label: "組織",
    codeKey: "soshiki_code",
  },
  {
    value: 3,
    label: "プロジェクト",
    codeKey: "project_id",
  },
  {
    value: 4,
    label: "個人",
    codeKey: "emplid",
  },
];

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  {ssr: false}
)

const PreviewInner = ({source}) => {
  const Content = useMDX(source);
  return (
    <Content/>
  )
}

const Preview = ({source}) => {
  return (
    <MDXProvider components={availableMdxComponents}>
      <PreviewInner source={source}/>
    </MDXProvider>
  )
}

export const MDXEditor = ({
  defaultValue,
  onSubmit,
}) => {
  const [message, setMessage] = React.useState();

  const [content, setContent] = React.useState();
  const [title, setTitle] = React.useState();
  const [mdxId, setMdxId] = React.useState();
  const [category, setCategory] = React.useState();
  const [publishedAt, setPublishedAt] = React.useState();
  const [ibNo, setIbNo] = React.useState();
  const [overview, setOverview] = React.useState();
  const [rangeFlag, setRangeFlag] = React.useState();
  const [paidFlag, setPaidFlag] = React.useState();
  const [will, setWill] = React.useState();
  const [tags, setTags] = React.useState();
  // サムネイルモーダル
  const [openThumbnail, setOpenThumbnail] = React.useState(false);
  const [thumbnailContentDraft, setThumbnailContentDraft] = React.useState();
  const [thumbnailContent, setThumbnailContent] = React.useState();
  // 公開範囲詳細設定
  const [openRestrict, setOpenRestrict] = React.useState(false);
  const [restrictType, setRestrictType] = React.useState();
  const [restrictCode, setRestrictCode] = React.useState();

  const {getRootProps, getInputProps, open} = useDropzone({
    // MDEditorをクリックした際にファイルブラウザが出るのを抑制
    noClick: true,
    onDrop: (files) => {
      const formData = new FormData();
      formData.append("files", files[0]);
      // APIに画像を送信
      axios.post("/api/images/upload", formData)
        .then((res) => {
          // URLをMDの中に埋め込む
          const url = res.data.url;
          const caretPosition = document.getElementById("md-editor").selectionStart;
          const before = (content ?? "").slice(0, caretPosition);
          const after = (content ?? "").slice(caretPosition);
          setContent(before + `![](${url})` + after);
        })
    }
  });

  const handleClickSave = async () => {
    const restrictTypeKey = defRestrictType.find((item) => item.value === restrictType)?.codeKey;
    const openRange = restrictTypeKey ? {
      restrict_type: restrictType,
      [restrictTypeKey]: restrictCode,
    } : {};
    const data = {
      content,
      metadata: {
        mdx_id: mdxId,
        category_id: category,
        title,
        overview: overview,
        ib_no: ibNo,
        thumbnail_content: thumbnailContent,
        prg_id: "doc_docs",
        range_flg: rangeFlag,
        paid_flg: paidFlag,
        will,
        // TODO: hookでユーザー情報を取得
        create_emplid: "",
        tags: tags?.split(",").map((str) => str.trim()),
        published_at: (publishedAt ?? moment()).toDate(),
        open_range: openRange,
      },
    }

    try {
      const res = await axios.post("/api/createPost", data);
      setMessage({
        value: "Success",
        severity: "success",
      });
      if (onSubmit) {
        onSubmit(data);
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
          <Button
            variant={"contained"}
            onClick={() => setOpenThumbnail(true)}
            sx={{marginLeft: 2}}
          >
            サムネイルを設定
          </Button>
          {/* TODO: 下書き保存 */}
          <Button
            variant={"contained"}
            onClick={handleClickSave}
            sx={{marginLeft: 2}}
          >保存</Button>
        </Grid>
        <Grid container spacing={2}>
          <Grid item sm={12}>
            <TextField
              id="title"
              label="タイトル"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>
          <Grid item sm={6}>
            <FormControl fullWidth>
              <InputLabel id="category-label" required>カテゴリ</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="カテゴリ"
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
              id="mdxId"
              label="ID"
              fullWidth
              value={mdxId}
              onChange={(e) => setMdxId(e.target.value)}
            />
          </Grid>
          <Grid item sm={6}>
            <TextField
              id="tag"
              label="タグ(カンマ区切り)"
              fullWidth
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </Grid>
          <Grid item sm={6}>
            <DateTimePicker
              label={"投稿日時"}
              onChange={setPublishedAt}
              value={publishedAt}
              renderInput={(props) => <TextField {...props} fullWidth/>}
              ampm={false}
            />
          </Grid>
          <Grid item sm={6}>
            <FormControl fullWidth>
              <InputLabel id="paid-flag-label" required>料金設定</InputLabel>
              <Select
                labelId="paid-flag-label"
                id="paid-flag"
                value={paidFlag}
                onChange={(e) => setPaidFlag(e.target.value)}
                label="PaidFlag"
                fullWidth
              >
                {defPaidFlag.map((item) => (
                  <MenuItem value={item.value} key={item.value}>{item.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={6}>
            <TextField
              id="will"
              label="Will"
              fullWidth
              value={will}
              onChange={(e) => setWill(e.target.value)}
              required={Boolean(paidFlag)}
              InputProps={{
                endAdornment: <InputAdornment position={"end"}>will</InputAdornment>
              }}
            />
          </Grid>
          <Grid item sm={6}>
            {/* TODO: 検索してselect 件数が多い */}
            <TextField
              id="ib_no"
              label="IB番号"
              fullWidth
              value={ibNo}
              onChange={(e) => setIbNo(e.target.value)}
            />
          </Grid>
          <Grid item sm={6}>
            <FormControl fullWidth>
              <InputLabel id="range-flag-label" required>公開範囲</InputLabel>
              <Select
                labelId="range-flag-label"
                id="range-flag"
                value={rangeFlag}
                onChange={(e) => setRangeFlag(e.target.value)}
                label="RangeFlag"
                fullWidth
                required
              >
                {defRangeFlag.map((item) => (
                  <MenuItem value={item.value} key={item.value}>{item.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            sm={12}
            sx={{display: "flex", justifyContent: "flex-end"}}
          >
            {rangeFlag === 1 && (
              <Button variant={"outlined"} onClick={() => setOpenRestrict(true)}>
                公開範囲詳細設定
              </Button>
            )}
          </Grid>
          <Grid item sm={12}>
            <TextField
              id="overview"
              label="Overview"
              fullWidth
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
            />
          </Grid>
          <Grid item sm={12}>
            <Box>
              <Button onClick={open}>
                アップロード(ツールバーの中に移動)
              </Button>
            </Box>
            <div data-color-mode="light" {...getRootProps()}>
              <input {...getInputProps()} />
              <div className="wmde-markdown-var"/>
              <MDEditor
                textareaProps={{
                  id: "md-editor"
                }}
                value={content}
                onChange={setContent}
                height={500}
                components={{
                  preview: (source) => <Preview source={source}/>
                }}
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={openThumbnail}
        onClose={() => {
          setThumbnailContentDraft(thumbnailContent);
          setOpenThumbnail(false);
        }}
        maxWidth={"800px"}
      >
        <DialogTitle>
          サムネイルを設定
        </DialogTitle>
        <DialogContent sx={{width: 800}}>
          {/* TODO: ラジオボタンで画像/mdxを選択 */}
          <Grid container>
            <Grid
              item
              sm={12}
              textAlign={"center"}
              sx={{
                borderWidth: 1,
                borderStyle: "dashed",
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderColor: "#8d91cc",
                backgroundColor: "#fafafa",
              }}
            >
              画像をアップロード(仮)
            </Grid>
            <Grid item sm={12} sx={{marginTop: 2}}>
              <div data-color-mode="light">
                <div className="wmde-markdown-var"/>
                <MDEditor
                  value={thumbnailContentDraft}
                  onChange={setThumbnailContentDraft}
                  height={500}
                  components={{
                    preview: (source) => <Preview source={source}/>
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setThumbnailContentDraft(null);
              setOpenThumbnail(false);
            }}
            variant={"outlined"}
            color={"error"}
          >
            キャンセル
          </Button>
          <Button
            onClick={() => {
              setThumbnailContent(thumbnailContentDraft);
              setOpenThumbnail(false);
            }}
            variant={"contained"}
          >
            確定
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openRestrict}
        onClose={() => {
          setOpenRestrict(false);
        }}
      >
        <DialogTitle>
          公開範囲詳細設定
        </DialogTitle>
        <DialogContent sx={{width: 600}}>
          <Grid container spacing={1}>
            <Grid item sm={12}>
              <FormControl fullWidth sx={{marginTop: 2}}>
                <InputLabel id="range-flag-label" required>公開範囲</InputLabel>
                <Select
                  disabled
                  labelId="range-flag-label"
                  id="range-flag"
                  value={rangeFlag}
                  label="RangeFlag"
                  fullWidth
                >
                  {defRangeFlag.map((item) => (
                    <MenuItem value={item.value} key={item.value}>{item.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={6} sx={{marginTop: 2}}>
              <FormControl fullWidth>
                <InputLabel id="restrict-type-label" required>公開対象</InputLabel>
                <Select
                  labelId="restrict-type-label"
                  id="restrict-type"
                  value={restrictType}
                  onChange={(e) => setRestrictType(e.target.value)}
                  label="RestrictType"
                  fullWidth
                >
                  {defRestrictType.map((item) => (
                    <MenuItem value={item.value} key={item.value}>{item.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={6} sx={{marginTop: 2}}>
              {/* TODO: 検索してselect */}
              <TextField
                id="restrict-code"
                label="対象コード"
                fullWidth
                value={restrictCode}
                onChange={(e) => setRestrictCode(e.target.value)}
                type={"number"}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenRestrict(false);
            }}
          >
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

