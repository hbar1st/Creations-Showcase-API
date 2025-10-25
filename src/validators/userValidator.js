
const { findUser } = require("../db/userQueries");

const { body } = require("express-validator");

const validateUserFields = [
  body("nickname")
    .trim()
    .notEmpty()
    .withMessage("A nickname is required for display purposes.")
    .isLength({ min: 1, max: 25 })
    .withMessage("Nicknames need to be between 1 and 25 characters long."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("An email is required.")
    .isEmail()
    .withMessage("Provide a valid email address.")
    .custom(async (value) => {
      console.log("try to validate if the email is unique: ", value);
      const userRow = await findUser(value);
      console.log("user row found: ", userRow);
      if (userRow) {
        throw new Error(
          "This email has already been registered. You must login instead."
        );
      } else {
        return true;
      }
    }),
  body('firstname').trim().notEmpty().withMessage("A first name is requried.")
  .isLength({min:1, max:25}).withMessage("Length of the first name should be between 1 and 25 characters."),
  body('lastname').trim().notEmpty().withMessage("A last name is required.")
  .isLength({min:1, max:50}).withMessage("Length of the last name should be between 1 and 50 characters."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("A password is required.")
    .isLength({ min: 8 })
    .withMessage(
      "A minimum length of 8 characters is needed for the password. Ideally, aim to use 15 characters at least."
    ),
  body("confirm-password")
    .trim()
    .notEmpty()
    .withMessage("A password confirmation is required.")
    .custom((value, { req }) => {
      console.log(value, req.body.password);
      if (value !== req.body.password) {
        throw new Error(
          "The password confirmation must match the password value."
        );
      } else {
        return true;
      }
    }),
];


module.exports = {
  validateUserFields,
};
