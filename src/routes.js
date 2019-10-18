const express = require('express');
const multer = require('multer')
const uploadsConfig = require('./config/upload')

const PostController = require('./controllers/PostController');
const LikeController = require('./controllers/LikeController')
const RankingController = require('./controllers/RankingController')
const UserController = require('./controllers/UserController')

const routes = new express.Router();
const upload = new multer(uploadsConfig);

routes.get('/posts', PostController.index)
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.getById);

routes.post('/posts', upload.single('image'), PostController.store);
routes.post('/users', upload.single('image'), UserController.store);

routes.put('/users/:id/point', upload.single('image'), RankingController.update);

routes.post('/posts/:id/like', LikeController.store);
routes.post('/users/:id/point', RankingController.store);

routes.delete("/posts/:id", PostController.delete);
routes.delete("/users/:id", UserController.delete);

module.exports = routes;