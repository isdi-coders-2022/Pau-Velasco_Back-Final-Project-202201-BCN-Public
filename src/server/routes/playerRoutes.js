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
  deletePlayerValidator,
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
router.delete(
  "/delete/:id",
  validate(deletePlayerValidator),
  auth,
  deletePlayer
);
router.put(
  "/update/:id",
  validate(createPlayerValidator),
  auth,
  upload.single("photo"),
  updatePlayer
);

module.exports = router;
