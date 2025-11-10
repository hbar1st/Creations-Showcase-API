const AuthError = require("../errors/AuthError");

const { body, param } = require("express-validator");

const { findAuthorById, findProject } = require("../db/projectQueries");

const checkTitle = () =>
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Projects require a title.")
    .isLength({ max: 100 })
    .withMessage("The title is too long. Use no more than 100 characters.");

const checkDescr = () =>
  body("descr")
    .trim()
    .notEmpty()
    .withMessage("Projects require a description.");

const checkLiveLink = () =>
  body("live-link")
    .trim()
    .optional()
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("The live link value is not a valid URL.");

const checkRepoLink = () =>
  body("repo-link")
    .trim()
    .optional()
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("The repo link value is not a valid URL.");

const checkKeywords = () =>
  body("keywords")
    .trim()
    .optional()
    .isLength({ max: 100 })
    .withMessage(
      "The keywords fields should not exceed 100 characters in total length."
    );

/*
options?: {
format?: string;
delimiters?: string[];
strictMode?: boolean;
}
*/
const checkPublished = () =>
  body("published")
    .trim()
    .isBoolean()
    .withMessage("The published field must be a true or false.")
    .customSanitizer((value) => {
      console.log("value of published: ", value);
      return (value === true || value === 'true') ? new Date().toISOString() : null;
    })
    .optional();

const checkAuthorId = () =>
  body("authorId")
    .trim()
    .notEmpty()
    .withMessage("Projects require an author.")
    .isInt({ min: 1 })
    .withMessage("Invalid type of author id.")
    .toInt()
    .custom(async (value) => {
      try {
        const author = await findAuthorById(value);

        console.log("author's row found: ", author);
        if (!author) {
          throw new Error("This user id is not authorized to create projects.");
        } else {
          return true;
        }
      } catch (error) {
        console.log(error);
        console.log(error.stack);
        throw error;
      }
    });

/**
 * confirm a body is provided and santize authorId to the user's id (from the jwt token)
 */
const prevalidation = [
  body()
    .exists()
    .withMessage("Invalid request. Missing request body.")
    .bail({ level: "request" }),
  body("authorId").customSanitizer((value, { req }) => Number(req.user.id)),
];

const validateOptionalProjectFields = [
  checkLiveLink(),
  checkRepoLink(),
  checkKeywords(),
  checkPublished(),
];

const validateEnhancedProjectFields = [
  prevalidation,
  checkProjectId(true),
  checkTitle(),
  checkDescr(),
  checkAuthorId(),
  ...validateOptionalProjectFields,
];

// used for creating a new project
const validateProjectFields = [
  prevalidation,
  checkTitle(),
  checkDescr(),
  checkAuthorId(),
  ...validateOptionalProjectFields,
];

const checkProjectIdStrict = checkProjectId(true);

function checkProjectId(strict = false) {
  return param("pid")
    .trim()
    .notEmpty()
    .withMessage("Project id is missing.")
    .isInt({ min: 1 })
    .withMessage("Projoect id's value is not valid.")
    .toInt()
    .custom(async (value, { req }) => {
      //confirm project exists with the current user's author id, otherwise, this is invalid
      try {
        const project = await findProject(value);

        if (!project) {
          throw new Error("Cannot find this project");
        }
        if (strict && project.authorId !== req.user.id) {
          throw new AuthError("Insufficient authority over project");
        }
        return true;
      } catch (error) {
        console.log(error);
        console.log(error.stack);
        throw error;
      }
    });
}

module.exports = {
  validateProjectFields,
  validateEnhancedProjectFields,
  checkProjectId,
  checkProjectIdStrict,
};
