import {getPost} from "../../util/mdxUtil";

const handler = async (req, res) => {
  const {category, slug} = req.query;
  try {
    const data = await getPost(category, slug);
    res.status(200).json({
      result: "Success",
      data,
    });
  } catch (e) {
    res.status(400).json({
      result: "Error",
    })
  }
}

export default handler;