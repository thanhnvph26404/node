import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
const bookSchema = new mongoose.Schema({
    name: String,
    price: Number,
    img: String,
    desc: String,
}, { timestamp: true, versionKey: false })

bookSchema.plugin(mongoosePaginate)
export default mongoose.model('Book', bookSchema)