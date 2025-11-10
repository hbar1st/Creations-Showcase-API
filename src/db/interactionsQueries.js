const prisma = require("../middleware/prisma.mjs");


async function updateProjectLikes(projectId, userId) {
  console.log("in updateProjectLikes: ", projectId, userId);

  const like = await prisma.default.like.upsert({
    where: {
      projectId_userId: {
        userId: Number(userId),
        projectId: Number(projectId),
      },
    },
    update: {
    },
    create: {
      userId: Number(userId),
      projectId: Number(projectId),
    },
  });
  return like;
}

async function removeProjectLike(projectId, userId) {
  console.log("in removeProjectLike: ", projectId, userId);

  const removedLike = await prisma.default.like.delete({
    where: {
      projectId_userId: {
        userId: Number(userId),
        projectId: Number(projectId),
      },
    },
  });
  return removedLike;
}

module.exports = {
  updateProjectLikes,
  removeProjectLike,
}