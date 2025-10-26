const { addNewUser } = require("../db/userQueries");

require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

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
      next();
    } else {
      throw new Error("Failed to create the new user record.")
    }
  } catch (err) {
    console.log((new Date()).toUTCString(), err);
    console.log(err.stack);
    throw (err);
  }
}

// sample login route /login/:email
function login(req, res, next) {
  const user = req.user;
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      sub: user.id,
    },
    process.env.JWT_SECRET
  );
  
  res.set({ Authorization: `Bearer ${token}` });
  res.status(200).json({ status: 'success', message: "Sign in successful." });
}

module.exports = {
  signUp,
  login,
};
