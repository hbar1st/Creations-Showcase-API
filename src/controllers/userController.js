const { addNewUser } = require("../db/userQueries");

require("dotenv").config();

const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken"); //TODO set up token when someone logs in

function logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: 'logout successful' });
  });
}

// sample login route /login/:email
function login(req, res, next) {
  console.log(
    "calling passport authenticate next: ",
    req.body
  );
  return passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed
      res.status(401).json({ message: `authentication failed: ${info.message}` });
    } else {
      req.logIn(user, (err) => {
        if (err) {
          res.status(500);
          return next(err);
        }
        console.log("user authenticated");
        return res.status(200).json({ message: "user authenticated" });
      });
    }
  })(req, res, next);
}

const signUp = [
  async (req, res, next) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, process.env.HASH_SALT);
    if (hashedPassword.length > 255) {
      next("Unexpected error: password length exceeded max length.")
    }
    const { nickname, email, firstname, lastname } = req.body;
    const newUser = await addNewUser(
      firstname, lastname, nickname, email, 
      hashedPassword
    );
    req.login(newUser, function (err) {
      if (err) {
        return next(err);
      }
      res.status(200).json({message: "login successful"});
    });
  }
];


module.exports = {
  signUp,
  login,
  logout
};

/*
app.post("/login", (req, res) => {
  let { email, password } = req.body;
//This lookup would normally be done using a database
if (email === "paul@nanosoft.co.za") {
if (password === "pass") {
//the password compare would normally be done using bcrypt.
opts.expiresIn = 120; //token expires in 2min
const secret = "SECRET_KEY"; //normally stored in process.env.secret
const token = jwt.sign({ email }, secret, opts);
return res.status(200).json({
message: "Auth Passed",
token,
});
}
}
return res.status(401).json({ message: "Auth Failed" });
});
*/
