const {
  addNewUser,
  deleteUser: dbDeleteUser,
  findUserByEmail,
  updateUser: dbUpdateUser,
} = require("../db/userQueries");

const AppError = require("../errors/AppError");
const AuthError = require("../errors/AuthError");

require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

function updateUser(req, res, next) {
  // if user wants to change the password, we need to re-hash it before storing it
  // other values the user may change are: email/nickname/firstname/lastname/nickname
  
}

async function signUp (req, res, next) {
  const hashedPassword = await bcrypt.hash(
    req.body.password,
    Number(process.env.HASH_SALT)
  );
  const { nickname, email, firstname, lastname } = req.body;
  try {
    const newUser = await addNewUser(
      firstname,
      lastname,
      nickname,
      email,
      hashedPassword
    );
    
    if (newUser) {
      req.user = newUser;
      res.status(201).json({ status: 'success', message: "Sign up successful." });
    } else {
      throw new AppError("Failed to create the new user record.", 500)
    }
  } catch (err) {
    throw new AppError('Failed to create the new user record', 500, err);
  }
}

// sample login route /login/:email
async function login(req, res) {
  console.log("in login: ", req.body);
  try {
    const user = await findUserByEmail(req.body.email);
    if (!user) {
      console.log("the user's email is not in the db")
      throw new AuthError('Incorrect email or password.');
    } 
    // confirm password match?
    
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      // passwords do not match!
      console.log("it's the wrong password");
      throw new AuthError("Incorrect email or password.");
    }
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        sub: user.id,
      },
      process.env.JWT_SECRET
    );
    
    res.set({ Authorization: `Bearer ${token}` });
    res.status(201).json({ status: 'success', message: "Login successful." });
    
  } catch (error) {
    throw new AppError("Failed to access the user record.",500, err)
  }
}

async function deleteUser (req, res) {
  const user = req.user;
  
  try {
    const deletedUser = await dbDeleteUser(user.id);
    if (deletedUser) {
      res.status(200).json({ status: 'success', message: "Delete complete." });
    } else {
      throw new AppError('Failed to delete the user records. Contact support.', 500);
    }
  } catch (err) {
    throw new AppError('Failed to delete the user records. Contact support.', 500, err);
  }
}

module.exports = {
  signUp,
  login,
  deleteUser,
};
