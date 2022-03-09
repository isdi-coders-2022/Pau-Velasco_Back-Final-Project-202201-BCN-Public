const express = require("express");
const createPlayer = require("../controllers/playerControllers");
const { loginUser, loadUser } = require("../controllers/userControllers");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/login", loginUser);
router.post("/load-user", auth, loadUser);
router.get("/create-player", createPlayer);

module.exports = router;
