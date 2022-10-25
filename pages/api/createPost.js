import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = async (req, res) => {
  const {content, metadata} = req.body;
  try {
    await prisma.post.create({
      data: {
        title: metadata.title,
        slug: metadata.slug,
        categoryId: metadata.category,
        body: content,
      }
    });
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