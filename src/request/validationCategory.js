import { body, validationResult } from 'express-validator';

const validationCategory = [
  body('nome').notEmpty().withMessage('A senha precisa ser fornecida')
]

export default validationCategory;