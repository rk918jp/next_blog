const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const main = async () => {
  const hoge = await prisma.category.create({
    data: {
      id: "blog",
      label: "Blog",
    },

  });
  const fuga = await prisma.category.create({
    data: {
      id: "reference",
      label: "Reference",
    },
  });
  const post = await prisma.post.create({
    data: {
      title: "test",
      slug: "test",
      body: "#### heading",
      categoryId: "blog",
    },
  });
};

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });