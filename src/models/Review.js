
import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    comentarios: {
        type: String
    },
    avaliacao: {
        type: Number
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    livro_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    },
}, {
    timestamps: true 
})

export default mongoose.model('Review', ReviewSchema);