const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  signout,
  requireSignin
} = require("../controllers/auth");
const { userSignupValidator } = require("../validator");
//invoking signup method from controller and pass into post method in router
router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);
module.exports = router;
