//const { PrismaClient } = require("../generated/prisma/client");
const prisma = require("../middleware/prisma.mjs");

async function addNewProject(
  authorId,
  { title, descr, live_link, repo_link, keywords, published }
) {
  const newProject = await prisma.default.project.create({
    data: {
      authorId: Number(authorId),
      title,
      descr,
      live_link,
      repo_link,
      keywords,
      published: published,
    },
  });
  return newProject;
}

/**
 * get the project and all its likes/comments/viewCounts
 * @param {*} userId
 * @returns
 */
async function getProjectsByUser(userId) {
  console.log("in getProjectsByUser: ", userId);

  const projects = await prisma.default.project.findMany({
    where: { authorId: Number(userId) },
    include: {

      images: true,
      _count: {
        select: {
          likes: true,
          comments: true
        }
      }
    },
  });

  console.log("return projects: ", projects);
  return projects;
}

/**
 * just confirms that the project exists, returns only pid to confirm
 * @param {*} projectId 
 */
async function findProject(projectId) {
  console.log("in findProject: ", projectId)
  const project = await prisma.default.project.findUnique({
    where: { id: Number(projectId) },
    select: {
      id: true,
      authorId: true
    }
  })
  return project;
}
/**
 * get the project and all its likes/comments/viewCounts
 * @param {*} projectId
 * @returns
 */
async function getProjectById(projectId) {
  console.log("in getProjectsById: ", projectId);

  const project = await prisma.default.project.findUnique({
    where: { id: Number(projectId) },
    include: {
      images: true,
      likes: true,
      comments: true,
    },
  });

  console.log("return project: ", project);
  return project;
}

/**
 * Will try to confirm if the id is a user who is also an author
 * @param {*} id
 * @returns
 */
async function findAuthorById(id) {
  console.log("in findAuthorById: ", id);
  // By unique identifier
  const author = await prisma.default.author.findUnique({
    where: {
      userId: Number(id),
    },
  });
  console.log("return author: ", author);
  return author;
}


async function addNewImage(projectId, name, public_id, type, url) {
  console.log("in addNewImage: ", projectId, name, public_id, type, url);

  const image = await prisma.default.image.create({
    data: {
      name,
      public_id,
      type,
      url,
      projectId: Number(projectId)
    }
  })
  return image;
}

async function getProjectImage(projectId) {
  console.log("in getProjectImage: ", projectId)
  const image = await prisma.default.image.findFirst({
    where: {
      projectId: Number(projectId)
    }
  })
  return image;
}

module.exports = {
  getProjectImage,
  addNewProject,
  getProjectById,
  findProject,
  findAuthorById,
  addNewImage,
  /*
  deleteProject,
  getAllProjects,
  updateProject,*/
  getProjectsByUser,
};
