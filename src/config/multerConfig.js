// multerConfig.js - Configuração mais simples
import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

// export const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
//   fileFilter: (req, file, cb) => {
//     console.log('Arquivo recebido:', file);
    
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Apenas imagens são permitidas'));
//     }
//   }
// });

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    fieldSize: 10 * 1024 * 1024, // 10MB para cada campo
    fieldNameSize: 300, // Tamanho máximo do nome do campo
    fields: 20, // Máximo de campos não-arquivo
    files: 5, // Máximo de arquivos
    parts: 25, // Máximo total de partes
    headerPairs: 2000 // Máximo de header pairs
  },
  fileFilter: (req, file, cb) => {
    console.log('=== FILE FILTER DEBUG ===');
    console.log('File:', file);
    console.log('Original name:', file.originalname);
    console.log('Mimetype:', file.mimetype);
    console.log('========================');
    
    // Aceitar qualquer tipo de imagem
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      console.log('Arquivo rejeitado: não é imagem');
      return cb(new Error('Apenas imagens são permitidas!'), false);
    }
    
    cb(null, true);
  }
});