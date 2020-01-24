const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const {
  userById,
  read,
  update,
  purchaseHistory
} = require("../controllers/user");

router.get(
  "/secret/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  (request, response) => {
    response.json({
      user: request.profile
    });
  }
);
router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);
router.get("/orders/by/user/:userId", requireSignin, isAuth, purchaseHistory);
//anytime route contains userId userbyid method will run
router.param("userId", userById);
module.exports = router;
