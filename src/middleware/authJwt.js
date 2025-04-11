import jwt from 'jsonwebtoken';

export function verifyJWT(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Remove "Bearer "
  
  if (!token) {
    return res.status(401).json({ 
      auth: false, 
      message: 'Token não fornecido' 
    });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ 
        auth: false, 
        message: 'Token inválido ou expirado' 
      });
    }
    
    req.userId = decoded.id;
    next();
  });
}