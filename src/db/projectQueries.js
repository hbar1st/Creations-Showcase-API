//const { PrismaClient } = require("../generated/prisma/client");
const prisma = require("../middleware/prisma.mjs");

async function addNewProject(authorId, { title, descr, live_link, repo_link, keywords, published } ) {
  const newProject = await prisma.default.project.create({
    data: {
      authorId: Number(authorId),
      title,
      descr,
      live_link,
      repo_link,
      keywords,
      published: published.toISOString()
    }
  });
  return newProject;
}

/**
 * get the project and all its likes/comments/viewCounts
 * @param {*} userId 
 * @returns 
 */
async function getProjectsByUser(userId) {
  console.log("in getProjectsByUser: ", userId)
  
  const projects = await prisma.default.project.findMany(
    {
      where: { authorId: Number(userId) },
      include: {
        images: true,
        likes: true,
        comments: true,
      },
    }
  );
  
  console.log("return projects: ", projects);
  return projects;
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

module.exports = {
  addNewProject,
  getProjectById,
  findAuthorById,
  /*
  deleteProject,
  getAllProjects,
  updateProject,*/
  getProjectsByUser,
};
