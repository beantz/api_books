import { body, validationResult } from 'express-validator';

const validateUserRegister = [
  body('name').isString().withMessage('Nome deve ser uma string').notEmpty().withMessage('A senha precisa ser fornecida'),
  body('email').isEmail().withMessage('E-mail inválido').notEmpty().withMessage('O e-mail precisa ser fornecida'),
  body('password').notEmpty().withMessage('A senha precisa ser fornecida'),
];

export default validateUserRegister;