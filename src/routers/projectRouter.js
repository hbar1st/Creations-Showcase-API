// Routes belonging to /projects

const { Router } = require("express");
const { getUserProjects, getProjectDetails,
  addProject, addImageToProject } = require("../controllers/projectController")
const {
  validateProjectFields,
  validateImageFields, checkProjectId } = require("../validators/projectValidator")


const { handleExpressValidationErrors } = require("./routerUtil");

const passport = require("passport");

const projectRouter = Router();

// note that we retrieve the user id from the jwt token so we don't need it specified in the route
projectRouter
  .route("/user")
  .get(passport.authenticate("jwt", { session: false }), getUserProjects)
  .post(
    passport.authenticate("jwt",{ session: false }),
    validateProjectFields,
    handleExpressValidationErrors,
    addProject);
    // TODO add project delete and project update

projectRouter
  .route("/:pid/image")
  .post(passport.authenticate("jwt", { session: false }),  validateImageFields, handleExpressValidationErrors, addImageToProject);
//TODO add image delete and image update?
  
projectRouter.route("/:pid").get(
  (req, res, next) => { console.log("in the route"); next() },
  checkProjectId(), handleExpressValidationErrors, getProjectDetails);

module.exports = projectRouter;
