import jwt from 'jsonwebtoken';
import redis from '../config/redis.js'

export async function verifyJWT(req, res, next) {
  if(req.path === '/logout') return next();

  const token = req.headers['authorization']?.split(' ')[1]; // Remove "Bearer "
  console.log("token", token);
  // const tokenNotBearer = token.split(' ')[1];

  //verifica se token passado num ta na lista de tokens q foram feito o logout
  const isBlacklisted = await redis.get(`blacklist:${token}`);
  if (isBlacklisted) {
    return res.status(401).json({ message: "Token inválido (logout realizado)" });

  }

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
