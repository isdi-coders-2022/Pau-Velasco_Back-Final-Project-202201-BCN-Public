const express = require("express");
const multer = require("multer");
const {
  createPlayer,
  deletePlayer,
} = require("../controllers/playerControllers");
const auth = require("../middlewares/auth");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/create-player", auth, upload.single("photo"), createPlayer);
router.delete("/delete/:id", auth, deletePlayer);

module.exports = router;
