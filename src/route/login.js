import express from 'express';
import loginController from '../controllers/loginController.js';
import validateUser from '../middleware/validationLogin.js';
import validateUserRegister  from '../middleware/validateUserRegister.js';

const loginRouter = express.Router();

loginRouter 
    .post('/login', validateUser, (req, res) => loginController.auth(req, res))
    .post('/logout', (req, res) => loginController.logout(req, res))
    .post('/cadastro', validateUserRegister, (req, res) => loginController.register(req,res))

export default loginRouter;
