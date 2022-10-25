import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = async (req, res) => {
  const {category, slug} = req.body;
  try {
    await prisma.post.delete({
      where: {
        slug,
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