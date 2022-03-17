const express = require("express");
const multer = require("multer");
const {
  createPlayer,
  deletePlayer,
  updatePlayer,
} = require("../controllers/playerControllers");
const auth = require("../middlewares/auth");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/create-player", auth, upload.single("photo"), createPlayer);
router.delete("/delete/:id", auth, deletePlayer);
router.put("/update/:id", upload.single("photo"), updatePlayer);

module.exports = router;
