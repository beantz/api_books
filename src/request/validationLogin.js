import { body, validationResult } from 'express-validator';

const validateUser = [
  body('email')
    .notEmpty().withMessage('O E-mail precisa ser fornecido')
    .bail()
    .isEmail().withMessage('E-mail inválido'),

  body('password').notEmpty().withMessage('A senha precisa ser fornecida'),
];

export default validateUser;