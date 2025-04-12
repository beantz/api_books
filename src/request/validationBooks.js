import { body, validationResult } from 'express-validator';

const validationBooks = [
  body('titulo').notEmpty().withMessage('O titulo precisa ser fornecido'),
  body('autor').notEmpty().withMessage('A autor precisa ser fornecido'),
  body('preco')
    .notEmpty().withMessage('A preço precisa ser fornecido')
    .bail()
    .isFloat({ min: 0.01 }).withMessage('O preço deve ser um número válido maior que zero')
    .toFloat(),
    
  body('descricao')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('A descrição não pode exceder 500 caracteres'),
    
  // Validação para selects (dropdowns)
  body('estado')
    .notEmpty().withMessage('O estado do livro deve ser selecionado')
    .bail()
    .isIn(['Novo', 'Usado - Bom', 'Usado - Regular', 'Usado - Ruim'])
    .withMessage('Estado do livro inválido'),
    
  body('categoria')
    .notEmpty().withMessage('A categoria deve ser selecionada')
    .bail()
    .isIn([
      'Fantasia',
      'Romance',
      'Terror / Suspense / Mistério',
      'Ficção Científica',
      'Histórico',
      'Autobiografias e Biografias',
      'Autoajuda',
      'Literatura Infantil'
    ]).withMessage('Categoria inválida')
];

export default validationBooks;