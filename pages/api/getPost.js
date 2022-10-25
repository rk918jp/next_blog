import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = async (req, res) => {
  const {category, slug} = req.query;
  try {
    const data = await prisma.post.findFirst({
      where: {
        slug,
      },
    });
    res.status(200).json({
      result: "Success",
      data,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      result: "Error",
    })
  }
}

export default handler;