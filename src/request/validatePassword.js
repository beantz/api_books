import { body, validationResult } from 'express-validator';

const validatePassword = [
  body('novaSenha')
    .notEmpty().withMessage('A senha precisa ser fornecida')
    .bail()
    .isLength({ min: 8 }).withMessage('A senha deve ter no mínimo 8 caracteres'),
]

export default validatePassword;