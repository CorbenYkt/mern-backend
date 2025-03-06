import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import {
  RegisterValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import * as CommentController from "./controllers/CommentController.js";
import cors from "cors";
import https from "https";
import fs from "fs";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mern-backend project DB Status - OK");
  })
  .catch((err) => {
    console.log("Mern-backend project DB Status - ERROR", err);
  });

const app = express();
const storage = multer.diskStorage({
  destination: (_, __, somecallback) => {
    somecallback(null, "uploads");
  },
  filename: (_, file, somecallback) => {
    somecallback(null, file.originalname);
  },
});

const uploadmulter = multer({ storage });
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post("/auth/login", loginValidation, UserController.Login);
app.post("/auth/register", RegisterValidation, UserController.Register);
app.get("/auth/me", UserController.GetMe);

app.post("/upload", checkAuth, uploadmulter.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts/", PostController.getAll);
app.get("/tags", PostController.getTags);
app.get("/posts/:id", PostController.getOne);
app.post("/posts/", checkAuth, postCreateValidation, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, PostController.update);
app.post("/comments/:id", checkAuth, CommentController.createComment);
app.get("/comments/:id", CommentController.getCommentsByPost);
app.delete("/comments/:id", checkAuth, CommentController.deleteComment);

const httpsServer = https.createServer(
  {
    key: fs.readFileSync("/etc/letsencrypt/live/mern.corbenykt.ru/privkey.pem"),
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/mern.corbenykt.ru/fullchain.pem"
    ),
  },
  app
);

httpsServer.listen(443, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server is running...");
});
