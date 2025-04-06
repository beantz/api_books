import { body, validationResult } from 'express-validator';

const validateUserRegister = [
  body('name')
    .notEmpty().withMessage('O nome precisa ser fornecido')
    .bail()
    .isString().withMessage('Nome deve ser uma string'),
    
  body('email')
    .notEmpty().withMessage('O e-mail precisa ser fornecido')
    .bail()
    .isEmail().withMessage('E-mail inválido'),
    
  body('password')
    .notEmpty().withMessage('A senha precisa ser fornecida')
    .bail()
    .isLength({ min: 8 }).withMessage('A senha deve ter no mínimo 8 caracteres'),
    
  body('confirmPassword')
    .notEmpty().withMessage('A confirmação de senha precisa ser fornecida')
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('As senhas não coincidem');
      }
      return true;
    }),
];

export default validateUserRegister;