const User = require("../models/user");
const jwt = require("jsonwebtoken"); //to generate signed token
const expressjwt = require("express-jwt"); //authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");
exports.signup = (request, response) => {
  // console.log(request.body);
  const user = new User(request.body);
  user.save((err, user) => {
    if (err) {
      return response.status(400).json({
        err: errorHandler(err)
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    response.json({
      user
    });
  });
};
exports.signin = (request, response) => {
  //find the user based on email
  const { email, password } = request.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return response.status(400).json({
        error: "user with that email does not exists please sign up"
      });
    }
    //if user found make sure email and password match
    //create authenticate method in user model
    if (!user.authenticate(password)) {
      return response.status(401).json({
        error: "email and password dont match"
      });
    }

    //generate signed token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //persists the token as 't' in cookie with expiry date
    response.cookie("t", token, { expire: new Date() + 9999 });
    //return response with token and user to front end client
    const { _id, name, email, role } = user;
    return response.json({
      token,
      user: { _id, name, email, role }
    });
  });
};

exports.signout = (request, response) => {
  response.clearCookie("t");
  response.json({
    message: "signed out."
  });
};

exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});

exports.isAuth = (request, response, next) => {
  let user =
    request.profile && request.auth && request.profile._id == request.auth._id;
  if (!user) {
    return response.status(403).json({
      error: "access denied"
    });
  }
  next();
};
exports.isAdmin = (request, response, next) => {
  if (request.profile.role === 0) {
    return response.status(403).json({
      err: "you dont have enough permissions to access.."
    });
  }
  next();
};
