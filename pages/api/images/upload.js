
const handler = async (req, res) => {
  const {content, metadata} = req.body;
  try {
    // NOTE: 本来は画像を配置してURLを返すべき所だが、適当にpublicの画像のパスを返す
    res.status(200).json({
      result: "Success",
      url: "http://localhost:3000/sample.jpg"
    })
  } catch (e) {
    console.error(e)
    res.status(400).json({
      result: "Error",
    })
  }
}

export default handler;