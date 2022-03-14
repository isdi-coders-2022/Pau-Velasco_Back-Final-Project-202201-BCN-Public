const jwt = require("jsonwebtoken");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const path = require("path");
const fs = require("fs");
const Player = require("../../database/models/player");
const User = require("../../database/models/user");

const firebaseConfig = {
  apiKey: "AIzaSyBPiBUPWvz-7MbKPmOpI1Kikzd7EioUrAU",
  authDomain: "futsalstats-dd617.firebaseapp.com",
  projectId: "futsalstats-dd617",
  storageBucket: "futsalstats-dd617.appspot.com",
  messagingSenderId: "1072061214810",
  appId: "1:1072061214810:web:8817ba8be09dc504a06863",
};

const fireBaseApp = initializeApp(firebaseConfig);
const storage = getStorage(fireBaseApp);

const createPlayer = async (req, res, next) =>
  new Promise((resolve) => {
    try {
      const { body } = req;

      const oldFileName = path.join("uploads", req.file.filename);
      const newFileName = path.join("uploads", req.body.name);
      fs.rename(oldFileName, newFileName, (error) => {
        if (error) {
          next(error);
        }
      });

      fs.readFile(newFileName, async (error, file) => {
        if (error) {
          next(error);
        } else {
          const storageRef = ref(storage, body.name);
          await uploadBytes(storageRef, file);

          const firebaseFileURL = await getDownloadURL(storageRef);
          body.photo = firebaseFileURL;

          const newPlayer = await Player.create(body);
          const headerAuthorization = req.header("authorization");
          const token = headerAuthorization.replace("Bearer ", "");
          const { username } = jwt.decode(token);
          const user = await User.findOne({ username });
          user.players.push(newPlayer);
          await user.save();

          res.status(201).json(newPlayer);
          resolve();
        }
      });
    } catch (error) {
      fs.unlink(path.join("uploads", req.file.filename), () => {
        error.code = 400;
        next(error);
      });
      error.message = "Error, can't create the player";
      error.code = 400;
      next(error);
    }
  });

const deletePlayer = async (req, res, next) => {
  try {
    const headerAuthorization = req.header("authorization");
    const token = headerAuthorization.replace("Bearer ", "");
    const { username } = jwt.decode(token);
    const { id } = req.params;
    const user = await User.findOne({ username });
    const userUpdated = await User.findOneAndUpdate(
      { username },
      {
        players: user.players.filter((player) => player.toString() !== id),
      },
      { new: true }
    );

    if (!userUpdated) {
      const error = new Error("This player doesn't belong to your user");
      error.code = 403;
      return next(error);
    }

    const deletedPlayer = await Player.findByIdAndDelete(id);
    if (!deletedPlayer) {
      const error = new Error("This player doesn't exist");
      error.code = 404;
      return next(error);
    }

    return res.json(userUpdated);
  } catch (error) {
    return next(error);
  }
};

module.exports = { createPlayer, deletePlayer };
