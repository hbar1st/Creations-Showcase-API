const { body, param } = require("express-validator");

const { findComment } = require("../db/interactionsQueries");
const { findProject } = require("../db/projectQueries");

const checkDeleteCommentRequirements = [
  param("pid")
    .trim()
    .notEmpty()
    .withMessage("A project id is missing")
    .custom(async (value, { req }) => {
      try {
        const project = await findProject(value);

        if (!project) {
          throw new Error("Cannot find this project");
        }

        const comment = await findComment(req.user.id, value);

        if (!comment) {
          throw new Error("Comment doesn't exist. Nothing to delete.");
        }
      } catch (error) {
        console.log(error);
        console.log(error.stack);
        throw error;
      }
    }),
];

const checkNewCommentRequirements = [
  param("pid")
    .trim()
    .notEmpty()
    .withMessage("A project id is missing")
    .custom(async (value) => {
      //confirm project exists with the current user's author id, otherwise, this is invalid
      try {
        const project = await findProject(value);

        if (!project) {
          throw new Error("Cannot find this project");
        }
      } catch (error) {
        console.log(error);
        console.log(error.stack);
        throw error;
      }
    }),
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Cannot add an empty comment.")
    .isLength({ min: 1, max: 400 })
    .withMessage(
      "Comments cannot be blank or greater than 400 characters long."
    ),
];

const checkUpdateCommentRequirements = [
  param("pid")
    .trim()
    .notEmpty()
    .withMessage("A project id is missing")
    .custom(async (value, { req }) => {
      //confirm project exists with the current user's author id, otherwise, this is invalid
      try {
        const project = await findProject(value);

        if (!project) {
          throw new Error("Cannot find this project");
        }
        const comment = await findComment(req.user.id, value);

        if (!comment) {
          throw new Error("Comment doesn't exist. Nothing to update.");
        }
      } catch (error) {
        console.log(error);
        console.log(error.stack);
        throw error;
      }
    }),
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Cannot update to an empty comment.")
  .isLength({min:1, max:400}).withMessage("Comments cannot be blank or greater than 400 characters long."),
];
module.exports = {
  checkNewCommentRequirements,
  checkUpdateCommentRequirements,
  checkDeleteCommentRequirements,
};
