import express from 'express';
import loginController from '../controllers/loginController.js';

const loginRouter = express.Router();

loginRouter 
    .post('/login', (req, res) => loginController.auth(req, res))
    .post('/logout', (req, res) => loginController.logout(req, res))
    .post('/cadastro', (req, res) => loginController.register(req,res))

export default loginRouter;