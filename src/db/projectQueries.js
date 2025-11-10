const prisma = require("../middleware/prisma.mjs");


async function updateProject(
  authorId, id,
  { title, descr, live_link, repo_link, keywords, published }
) {
  console.log(
    "in updateProject",
    authorId,
    id,
    title,
    descr,
    live_link,
    repo_link,
    keywords,
    published
  );
  const project = await prisma.default.project.update({
    where: {
      id: Number(id),
      authorId: Number(authorId),
    },
    data: {
      title,
      descr,
      live_link,
      repo_link,
      keywords,
      published,
    },
  });
  return project;
}


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
      published,
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
* get the project by pid and authorID and all its likes/comments/viewCounts
 * @param {*} authorId 
 * @param {*} projectId 
 * @returns 
 */
async function getProjectByAuthor(authorId, projectId) {
  console.log("in getProjectByAuthor: ", authorId, projectId);

  const project = await prisma.default.project.findUnique({
    where: {
      id: Number(projectId),
      authorId: Number(authorId)
    },
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
 * get all the project and all their respective likes/comments
 * @returns
 */
async function getAllProjects(published=true) {
  console.log("in getAllProjects: ");

  const projects = await prisma.default.project.findMany({
    where: {
      NOT: {
        published: null,
      },
    },
    include: {
      author: {
        select: {
          user: {
            select: {
              nickname: true,
            },
          },
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      images: true,
      likes: {
        select: {
          userId: true,
        },
      },
      comments: true,
    },
    orderBy: {
      authorId: 'desc',
    },
  });

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

async function upsertImage(projectId, name, public_id, type, url) {
  console.log("in updateImage: ", projectId, name, public_id, type, url);
  const image = await prisma.default.image.upsert({
    where: {
      public_id,
    },
    update: {
      name,
      type,
      url,
    },
    create: {
      projectId,
      name,
      public_id,
      type,
      url,
    },
  });
  return image;
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

async function getProjectImages(projectId) {
  console.log("in getProjectImages: ", projectId);
  const images = await prisma.default.image.findMany({
    where: {
      projectId: Number(projectId),
    },
  });
  return images;
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

async function deleteProject(pid) {
  console.log("in deleteProject: ", pid);
  const project = await prisma.default.project.delete({
    where: {
      id: Number(pid)
    }
  })
  return project;
}

async function deleteProjectImage(pid) {
  console.log("in deleteProjectImage: ", pid);
  const image = await prisma.default.image.deleteMany({
    where: {
      projectId: Number(pid)
    }
  })
  return image;
}

module.exports = {
  getProjectImage,
  getProjectImages, // should never be more than one in this iteration of the code
  addNewProject,
  getProjectById,
  getProjectByAuthor,
  findProject,
  findAuthorById,
  addNewImage,
  upsertImage,
  deleteProject,
  deleteProjectImage,
  updateProject,
  getProjectsByUser,
  getAllProjects,
};
