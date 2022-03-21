const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const {
  createPlayer,
  deletePlayer,
  updatePlayer,
} = require("../controllers/playerControllers");
const auth = require("../middlewares/auth");
const {
  createPlayerValidator,
} = require("../middlewares/validators/playerValidators");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/create-player",
  validate(createPlayerValidator),
  auth,
  upload.single("photo"),
  createPlayer
);
router.delete("/delete/:id", auth, deletePlayer);
router.put("/update/:id", auth, upload.single("photo"), updatePlayer);

module.exports = router;
