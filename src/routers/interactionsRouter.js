// Routes belonging to /projects

const { Router } = require("express");

const {
} = require("../controllers/interactionsController");

const {
} = require("../validators/interactionsValidator");

const { handleExpressValidationErrors } = require("./routerUtil");

const passport = require("passport");

const interactionsRouter = Router();



module.exports = interactionsRouter;
