const { getProjectsByUser, addNewProject } = require("../db/projectQueries");

const AppError = require("../errors/AppError");

async function getUserProjects(req, res) {
  console.log("in getUser");
  const user = req.user;
  if (user) {
    try {
      const projects = await getProjectsByUser(user.id);
      if (projects) {
      
        res.status(200).json({ status: "success", result: projects });
      } else {
      
        throw new AppError("Failed to access user's projects", 500);
      }
    } catch (error) {
      console.log(error, error.stack);
      throw error;
    }
  } else {
    throw new AppError("Failed to get the user record", 500);
  }
}

async function addProject(req, res) {
  console.log("in addNewProject: ", req.body)
  const user = req.user;
  if (!user) {
    throw new AppError("Failed to get the user record", 500);
  }
  // TODO fill the logic in to add a new project
  // start by adding the plain project then add code to add the featured image too
  try {
    const project = await addNewProject(user.id, req.body)
    if (project) {
        res.status(200).json({ status: "success", result: project });
    }
  } catch (error) {
    console.log(error, error.stack);
    throw error;
  }
}

module.exports = {
  getUserProjects,
  addProject
};
