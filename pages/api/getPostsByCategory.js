import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        posts: true,
      },
    });
    res.status(200).json({
      result: "Success",
      data: categories,
    });
  } catch (e) {
    res.status(400).json({
      result: "Error",
    })
  }
}

export default handler;