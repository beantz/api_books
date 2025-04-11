import express from 'express';
import authController from '../controllers/AuthController.js';
import validateUser from '../request/validationLogin.js';
import validateUserRegister  from '../request/validateUserRegister.js';
import validateEmail from '../request/validateEmail.js'
import { verifyJWT } from '../middleware/authJwt.js';

const loginRouter = express.Router();

loginRouter 
    .post('/login', validateUser, (req, res) => authController.auth(req, res))
    .post('/logout', verifyJWT ,(req, res) => authController.logout(req, res))
    .post('/cadastro', validateUserRegister, (req, res) => authController.register(req,res))
    .post('/esqueci-senha', validateEmail ,(req, res) => authController.requestPasswordReset(req, res))
    .post('/validar-codigo', (req, res) => authController.verifyCode(req, res))
    .post('/redefinir-senha', (req, res) => authController.verifyAndResetPassword(req, res))

export default loginRouter;
