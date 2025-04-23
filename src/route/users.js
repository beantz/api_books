import userController from '../controllers/UserController.js';
import express from 'express';

const usersRouter = express.Router();

usersRouter
    .get('/users/:userId', (req, res) => userController.getUserById(req, res))
    .put('/users/:userId', (req, res) => userController.updateUser(req, res))

export default usersRouter;