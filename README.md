
# MERN Backend

This repository contains the API for the main website https://corbenykt.github.io/mernproject. This backend is dedicated to the project, which is a website of a regular information portal. The API is built using Node.js and Express and handles following requests:

```javascript
app.post('/auth/login', loginValidation, UserController.Login);
app.post('/auth/register', RegisterValidation, UserController.Register);
app.get('/auth/me', checkAuth, UserController.GetMe);

app.get('/posts/', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts/', checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);
```
As you see this one is more complex than MovieAdvisor's API. The structure is straightforward: the frontend is hosted on GitHub, the API is deployed on an AWS EC2 server, and MongoDB is used to store data.

# What is implemented in this project?**

1. Working with MongoDB, Express, ReactJS, and Node.js — in other words, the MERN stack (MongoDB + Express + ReactJS + Node.js).  
2. Use of two controllers: one for managing users and another for managing posts (articles).  
3. Two data models: users and posts. Everything is well-structured. The post structure is fairly simple: `title`, `text`, `tags`, `viewsCount`, `user`, and `imageUrl`. The user structure includes: `fullName`, `email`, `passwordHash`, and `avatarUrl`.  
4. Data validation is implemented at various levels: during user authentication and registration, as well as when creating a post (article).  
5. Use of `jsonwebtoken` to implement authorization.  
6. Use of `bcrypt` for hashing user passwords.  
7. Use of `multer` for handling file uploads (images).

The AWS EC2 server runs on port 4444 and uses an SSL certificate. This setup is necessary because GitHub, which hosts the frontend, also uses a certificate. To ensure secure communication, frontend requests to the backend are encrypted.

Links:
Website/Frontend: https://corbenykt.github.io/mernproject

Backend(this): https://github.com/CorbenYkt/mern-backend