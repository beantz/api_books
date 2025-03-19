import { body, validationResult } from 'express-validator';

const validateUser = [
  body('email').isEmail().withMessage('E-mail inválido').notEmpty().withMessage('O e-mail precisa ser fornecida'),
  body('password').notEmpty().withMessage('A senha precisa ser fornecida'),
];

export default validateUser;