import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

// Certifique-se que o diretório existe
const uploadDir = 'src/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Extrai a extensão do arquivo de forma segura
    const extensao = path.extname(file.originalname).toLowerCase();
    // Gera um nome único para o arquivo
    const novoNome = crypto.randomBytes(32).toString('hex') + extensao;
    // Armazena o nome do arquivo no request para uso posterior
    req.generatedFilename = novoNome;
    cb(null, novoNome);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado. Apenas imagens são permitidas.'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});

export default upload;