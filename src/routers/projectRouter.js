// Routes belonging to /projects

const { Router } = require("express");
const {
  getUserProjects,
  getProjectDetails,
  addProject,
  deleteProjectImage,
  deleteProject,
  addImageToProject } = require("../controllers/projectController")

const {
  validateProjectFields,
  checkProjectId
} = require("../validators/projectValidator")


const { handleExpressValidationErrors } = require("./routerUtil");

const passport = require("passport");

const projectRouter = Router();

// note that we retrieve the user id from the jwt token so we don't need it specified in the route
projectRouter
  .route("/user")
  .get(passport.authenticate("jwt", { session: false }), getUserProjects);


projectRouter.route("/")
  .post( //add a new project for this user
    passport.authenticate("jwt",{ session: false }),
    validateProjectFields,
    handleExpressValidationErrors,
    addProject);
    
projectRouter
  .route("/:pid/image")
  .delete(passport.authenticate("jwt", { session: false }),
    checkProjectId(true),
    handleExpressValidationErrors,
    deleteProjectImage
  )
  .post(
    passport.authenticate("jwt", { session: false }),
    checkProjectId(true),
    handleExpressValidationErrors,
    addImageToProject
  )
  .put(
    passport.authenticate("jwt", { session: false }),
    checkProjectId(true),
    handleExpressValidationErrors,
    addImageToProject
  );
  
  
// TODO add project update
projectRouter
  .route("/:pid")
  .get(checkProjectId(), handleExpressValidationErrors, getProjectDetails)
  .delete(passport.authenticate("jwt", { session: false }),
    checkProjectId(true),
    handleExpressValidationErrors,
    deleteProject);

module.exports = projectRouter;
