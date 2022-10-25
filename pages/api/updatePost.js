import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = async (req, res) => {
  const {content, metadata} = req.body;
  try {
    await prisma.post.update({
      where: {
        slug: metadata.slug,
      },
      data: {
        title: metadata.title,
        body: content,
      }
    })
    res.status(200).json({
      result: "Success",
    })
  } catch (e) {
    console.error(e)
    res.status(400).json({
      result: "Error",
    })
  }
}

export default handler;