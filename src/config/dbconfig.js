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