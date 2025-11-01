// Routes belonging to /projects

const { Router } = require("express");
const { getUserProjects, addProject } = require("../controllers/projectController")
const { validateProjectFields } = require("../validators/projectValidator")


const { handleExpressValidationErrors } = require("./routerUtil");

const passport = require("passport");

const projectRouter = Router();

// note that we retrieve the user id from the jwt token so we don't need it specified in the route
projectRouter
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), getUserProjects)
  .put(
    passport.authenticate("jwt",{ session: false }),
    validateProjectFields,
    handleExpressValidationErrors,
    addProject);

module.exports = projectRouter;
