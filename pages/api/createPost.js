import {createPost} from "../../util/mdxUtil";

const handler = async (req, res) => {
  const {content, metadata} = req.body;
  try {
    await createPost(content, metadata);
    res.status(200).json({
      result: "Success",
    })
  } catch (e) {
    res.status(400).json({
      result: "Error",
    })
  }
}

export default handler;