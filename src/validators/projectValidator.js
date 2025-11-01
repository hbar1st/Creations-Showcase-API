
const { body, param } = require("express-validator");

const {
  findAuthorById,
} = require("../db/projectQueries");

const checkTitle = () => 
  body('title').trim().notEmpty().withMessage("New projects requires a title.")
.isLength({max: 100}).withMessage("The title is too long. Use no more than 100 characters.")


const checkDescr = () => 
  body("descr")
.trim()
.notEmpty()
.withMessage("New projects require a description.")


const checkLiveLink = () => 
  body("live-link").trim().optional().isURL({ protocols: ['http', 'https'], require_protocol: true })
.withMessage("The live link value is not a valid URL.")


const checkRepoLink = () => 
  body("repo-link")
.trim()
.optional()
.isURL({ protocols: ["http", "https"], require_protocol: true })
.withMessage("The repo link value is not a valid URL.")


const checkKeywords = () => 
  body("keywords").trim().optional()
.isLength({min: 1, max: 100}).withMessage("The keywords fields should not exceed 100 characters in total length.")


/*
options?: {
format?: string;
delimiters?: string[];
strictMode?: boolean;
}
*/
const checkPublished = () => 
  body('published').trim().optional()
.isDate().withMessage("The published field must be a date field.")


const checkAuthorId = () =>
  body('authorId')
.trim()
.notEmpty()
.withMessage("New projects require an author.")
.isInt({ min: 1 })
.withMessage("Invalid type of author id.")
.toInt()
.custom(async (value) => {
  try {
    const author = await findAuthorById(value);
    
    console.log("author's row found: ", author);
    if (!author) {
      throw new Error(
        "This user id is not authorized to create projects."
      );
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
    console.log(error.stack);
    throw error;
  }
})

const prevalidation = [
  body().exists().withMessage("Invalid request. Missing request body.").bail({ level: 'request' }),
  body('authorId').customSanitizer((value, { req }) => value ?? Number(req.user.id)),
  (req, res, next) => {
    console.log("after sanitization: ", req.body),
    next();
  }
]
// used for creating a new project
const validateProjectFields = [
  
  prevalidation,
  checkAuthorId(),
  checkTitle(),
  checkDescr(),
  checkLiveLink(),
  checkRepoLink(),
  checkKeywords(),
  checkPublished(),
]

module.exports = {
  validateProjectFields,
};

