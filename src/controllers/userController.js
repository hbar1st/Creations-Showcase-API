const {
  addNewUser,
  deleteUser: dbDeleteUser,
  findUserByEmail,
  updateUser: dbUpdateUser,
} = require("../db/userQueries");

const AppError = require("../errors/AppError");
const AuthError = require("../errors/AuthError");

// needed to read the hash salt value
require("dotenv").config();

// needed to hash the password value
const bcrypt = require("bcrypt");

// needed to authenticate the requests
const jwt = require("jsonwebtoken"); 


async function getUser(req, res, next) {
  console.log("in getUser")
  const user = req.user;
  // remove id and password before sending on
  delete user.password;
  delete user.id;
  if (user) {
    res
    .status(200)
    .json({ status: "success", user });
  } else {
    throw new AppError("Failed to get the user record", 500);
  }
}

async function updateUser(req, res, next) {
  // if user wants to change the password, we need to re-hash it before storing it
  // other values the user may change are: email/nickname/firstname/lastname/nickname
  
  const user = req.user;
  console.log("in updateUser: ", user, req.body);
  const userDetails = { ...req.body };
  if (Object.hasOwn(userDetails, 'confirm-password')) {
    delete userDetails['confirm-password']
  }
  if (Object.hasOwn(userDetails, 'password')) {
    // user wants to change the password (I guess normally we'd ask for the old password, but I'm relying on jwt token here for security)
    userDetails.password = await bcrypt.hash(
      req.body.password,
      Number(process.env.HASH_SALT)
    );
  }
  try {
    console.log("user update details: ", userDetails)
    const updatedUser = await dbUpdateUser(user.id, userDetails)
    console.log("updatedUser: ", updatedUser);
    if (updatedUser) {
      res
      .status(200)
      .json({ status: "success", message: "Update successful." });
    } else {
      throw new AppError("Failed to update the user record", 500);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Failed to update the user record", 500, error);
    }
  }
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
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Failed to update the user record", 500, err);
    }
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
    //res.json({ token });
    res.set("Access-Control-Expose-Headers", "Authorization");
    
    res.status(201).json({ status: 'success', message: "Login successful." });
    
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Failed to update the user record", 500, error);
    }
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
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Failed to update the user record", 500, error);
    }
  }
}

module.exports = {
  signUp,
  login,
  getUser,
  updateUser,
  deleteUser,
};
