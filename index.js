import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { RegisterValidation, loginValidation, postCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controlles/UserController.js'
import * as PostController from './controlles/PostController.js'
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

mongoose.connect('mongodb+srv://vool34:wwwwww@movieadvisor.m94cj.mongodb.net/mernbackend')
  .then(() => {
    console.log('DB Status - OK')
  })
  .catch((err) => {
    console.log('DB Status - ERROR', err)
  })

const app = express();
const storage = multer.diskStorage({
  destination: (_, __, somecallback) => {
    somecallback(null, 'uploads');
  },
  filename: (_, file, somecallback) => {
    somecallback(null, file.originalname);
  },
});

const uploadmulter = multer({ storage });

app.use(express.json());
app.use(cors());

app.post('/auth/login', loginValidation, UserController.Login);
app.post('/auth/register', RegisterValidation, UserController.Register);
app.get('/auth/me', checkAuth, UserController.GetMe);

app.post('/upload', checkAuth, uploadmulter.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  });
})

app.post('/upload/avatar', uploadmulter.single('image'), (req, res) => {
  const uniqueName = `${uuidv4()}${path.extname(req.file.originalname)}`;
  const __dirname = path.dirname(uniqueName);
  const uploadPath = path.join(__dirname, 'uploads/avatars', uniqueName);
  
  fs.renameSync(req.file.path, uploadPath);

  res.json({
    url: `/uploads/avatars/${uniqueName}`
  });
})

app.get('/posts/', PostController.getAll);
app.get('/tags', PostController.getTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts/', checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server is running...');
});