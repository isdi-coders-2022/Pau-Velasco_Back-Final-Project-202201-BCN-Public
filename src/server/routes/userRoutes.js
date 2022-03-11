const express = require("express");
const createPlayer = require("../controllers/playerControllers");
const {
  loginUser,
  loadUserPlayers,
  loadUser,
} = require("../controllers/userControllers");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/login", loginUser);
router.get("/load-user-players", auth, loadUserPlayers);
router.post("/create-player", createPlayer);
router.get("/load-user", auth, loadUser);

module.exports = router;
