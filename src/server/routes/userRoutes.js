const express = require("express");
const { validate } = require("express-validation");
const {
  loginUser,
  loadUserPlayers,
  loadUser,
  registerUser,
} = require("../controllers/userControllers");
const auth = require("../middlewares/auth");
const {
  createUserValidator,
} = require("../middlewares/validators/userValidators");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", validate(createUserValidator), registerUser);
router.get("/load-user-players", auth, loadUserPlayers);
router.get("/load-user", auth, loadUser);

module.exports = router;
