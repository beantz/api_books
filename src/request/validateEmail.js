import { body, validationResult } from 'express-validator';

const validateEmail = [
  body('email')
  .notEmpty().withMessage('O e-mail precisa ser fornecido')
  .isEmail().withMessage('E-mail inválido'),
];

export default validateEmail;