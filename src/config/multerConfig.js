import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    fieldSize: 10 * 1024 * 1024, 
    fieldNameSize: 300, 
    fields: 20, 
    files: 5, 
    parts: 25,
    headerPairs: 2000
  },
  fileFilter: (req, file, cb) => {
    
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      console.log('Arquivo rejeitado: não é imagem');
      return cb(new Error('Apenas imagens são permitidas!'), false);
    }
    
    cb(null, true);
  }
});