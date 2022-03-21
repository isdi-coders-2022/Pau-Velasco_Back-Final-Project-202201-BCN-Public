const express = require("express");
const {
  loginUser,
  loadUserPlayers,
  loadUser,
  registerUser,
} = require("../controllers/userControllers");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/load-user-players", auth, loadUserPlayers);
router.get("/load-user", auth, loadUser);

module.exports = router;
