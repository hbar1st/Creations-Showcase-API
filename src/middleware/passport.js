const passport = require("passport");
require("../errors/AuthError");
// used to create salts or tokens 
const crypto = require("crypto");
require("dotenv").config();

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const { findUserById } = require("../db/userQueries");

const jwtopts = {};
jwtopts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
if (!process.env.JWT_SECRET) {
  console.log("found no jwt secret in .env, so must create one");
  const b = crypto.randomBytes(33); // any number over 32 is fine
  console.log(
    `Setup the JWT_SECRET value in .env with: ${b.toString("hex")}`
  );

  throw new AuthError("Failed to find a jwt secret in .env", 500);
}
jwtopts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(jwtopts, async function (jwt_payload, done) {
    console.log("passport authentication will use this payload value: ", jwt_payload.sub);
    if (jwt_payload.sub) {
      try {
        const user = await findUserById(jwt_payload.sub);
    
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
          // or you could create a new account ?
        }
      } catch (err) {
        return done(err);
      }
    } else {
      return done(null, false);
    }
  })
);

module.exports = passport;
