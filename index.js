import express from 'express';
import mongoose from 'mongoose';
import { RegisterValidation, loginValidation, postCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controlles/UserController.js'
import * as PostController from './controlles/PostController.js'
import cors from 'cors';

mongoose.connect('mongodb+srv://vool34:wwwwww@movieadvisor.m94cj.mongodb.net/mernbackend')
  .then(() => {
    console.log('DB Status - OK')
  })
  .catch((err) => {
    console.log('DB Status - ERROR', err)
  })

const app = express();
app.use(express.json());
app.use(cors());

app.post('/auth/login', loginValidation, UserController.Login);
app.post('/auth/register', RegisterValidation, UserController.Register);
app.get('/auth/me', checkAuth, UserController.GetMe);

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