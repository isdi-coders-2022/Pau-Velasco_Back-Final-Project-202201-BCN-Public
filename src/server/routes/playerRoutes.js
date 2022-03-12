const express = require("express");
const {
  createPlayer,
  deletePlayer,
} = require("../controllers/playerControllers");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/create-player", auth, createPlayer);
router.delete("/delete/:id", auth, deletePlayer);

module.exports = router;
