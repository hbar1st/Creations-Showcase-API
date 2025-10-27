
const { findUser } = require("../db/userQueries");
const { body, checkExact } = require("express-validator");

const checkNickname = (optional) => {
  let ch1 = body("nickname").trim();
  ch1 = optional ? ch1.optional({ checkFalsy: true }) : ch1;
  return ch1
    .notEmpty()
    .withMessage("A nickname is required for display purposes.")
    .isLength({ min: 1, max: 25 })
    .withMessage("Nicknames need to be between 1 and 25 characters long.");
}

const checkEmail = (optional) => {
  let ch1 = body('email').trim();
  ch1 = optional ? ch1.optional({ checkFalsy: true }) : ch1;
  return ch1
    .notEmpty()
    .withMessage("An email is required.")
    .isEmail()
    .withMessage("Provide a valid email address.")
    .custom(async (value) => {
      console.log("try to validate if the email is unique: ", value);
      try {
        const userRow = await findUser(value);

        console.log("user row found: ", userRow);
        if (userRow) {
          throw new Error(
            "This email has already been registered. You must login instead."
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
}

const checkFirstname = (optional) => {
  let ch1 = body('firstname').trim();
  ch1 = optional ? ch1.optional({ checkFalsy: true }) : ch1;
  return ch1
    .notEmpty()
    .withMessage("A first name is requried.")
    .isLength({ min: 1, max: 25 })
    .withMessage(
      "Length of the first name should be between 1 and 25 characters."
    )
}

const checkLastname = (optional) => {
  let ch1 = body("lastname").trim();
  ch1 = optional ? ch1.optional({ checkFalsy: true }) : ch1;
  return ch1
    .notEmpty()
    .withMessage("A last name is required.")
    .isLength({ min: 1, max: 50 })
    .withMessage(
      "Length of the last name should be between 1 and 50 characters."
    )
}

const checkPassword = (optional) => {
  let ch1 = body("password").trim()
  ch1 = optional ? ch1.optional({ checkFalsy: true }) : ch1;
  return ch1
    .notEmpty()
    .withMessage("A password is required.")
    .isLength({ min: 8 })
    .withMessage(
      "A minimum length of 8 characters is needed for the password. Ideally, aim to use 15 characters at least."
    )
    .hide("*****");
}


const checkPasswordConfirmation = () => {
  let ch1 = body("confirm-password").if(body("password").notEmpty()).trim();
  return ch1
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
    })
    .hide('*****');
}

// used for user updates
const validateOptionalUserFields = [
  checkExact(
    [
      checkNickname(true),
      checkEmail(true),
      checkFirstname(true),
      checkLastname(true),
      checkPassword(true),
      checkPasswordConfirmation(),
    ],
    {
      message: "Too many fields specified.",
    }
  ),
];

// used for creating a new user
const validateUserFields = [
  checkNickname(false),
  checkEmail(false),
  checkFirstname(false),
  checkLastname(false),
  checkPassword(false),
  checkPasswordConfirmation(),
];

module.exports = {
  validateUserFields,
  validateOptionalUserFields,
};
