import {deletePost} from "../../util/mdxUtil";

const handler = async (req, res) => {
  const {category, slug} = req.body;
  try {
    await deletePost(category, slug);
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