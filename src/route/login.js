import { Router } from 'express';
import loginController from '../controllers/login.js';

const route = new Router();

route.post('/login', (req, res) => loginController.auth(req, res));

export default route;