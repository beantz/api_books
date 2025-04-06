import { body, validationResult } from 'express-validator';

const validationBooks = [
  body('titulo').notEmpty().withMessage('O titulo precisa ser fornecido'),
  body('autor').notEmpty().withMessage('A autor precisa ser fornecido'),
  // body('categoria').notEmpty().withMessage('A categoria precisa ser fornecida'),
  body('preco')
    .notEmpty().withMessage('A preço precisa ser fornecido')
    
];

export default validationBooks;