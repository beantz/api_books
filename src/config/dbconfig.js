// import mysql from "mysql2/promise";

// async function connect(){
//     if(global.connection && global.connection.state !== 'disconnected')
//         return global.connection;
 
//     const connection = await mysql.createConnection("mysql://beatriz:senha123Be!@localhost:3306/books_api");
//     console.log("Conectou no MySQL!");
//     global.connection = connection;
//     return connection;
// }

// export default connect();

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("✅ Conectado ao MongoDB"))
        .catch(err => console.error("❌ Erro na conexão:", err));
    console.log('✅ MongoDB conectado com sucesso!');
  } catch (err) {
    console.error('❌ Falha na conexão com MongoDB:', err.message);
    process.exit(1); // Encerra o aplicativo em caso de erro
  }
};

export default connectDB;