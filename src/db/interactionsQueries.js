const prisma = require("../middleware/prisma.mjs");

async function addOrUpdateComment(userId, projectId, content) {
  console.log("in addComment: ", userId, projectId, content);

  const comment = await prisma.default.comment.upsert({
    where: {
      projectId_userId: {
        userId: Number(userId),
        projectId: Number(projectId),
      },
    },
    create: {
      content,
      projectId: Number(projectId),
      userId: Number(userId),
    },
    update: {
      content,
    },
  });
  return comment;
}

async function updateProjectLikes(projectId, userId) {
  console.log("in updateProjectLikes: ", projectId, userId);

  const like = await prisma.default.like.upsert({
    where: {
      projectId_userId: {
        userId: Number(userId),
        projectId: Number(projectId),
      },
    },
    update: {},
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

async function findComment(userId, projectId) {
  console.log("in findComment: ", userId, projectId);
  const comment = await prisma.default.comment.findUnique({
    where: {
      projectId_userId: {
        userId: Number(userId),
        projectId: Number(projectId),
      },
    },
  });
  return comment;
}

async function deleteComment(userId, projectId) {
  console.log("in findComment: ", userId, projectId);
  const comment = await prisma.default.comment.delete({
    where: {
      projectId_userId: {
        userId: Number(userId),
        projectId: Number(projectId),
      },
    },
  });
  return comment;
}

module.exports = {
  findComment,
  deleteComment,
  updateProjectLikes,
  removeProjectLike,
  addOrUpdateComment,
};
