const express = require("express");
const { loginUser, loadUser } = require("../controllers/userControllers");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/login", loginUser);
router.post("/load-user", auth, loadUser);

module.exports = router;
