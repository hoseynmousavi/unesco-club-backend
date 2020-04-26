import mongoose from "mongoose"

const schema = mongoose.Schema

const documentModel = new schema({
    title: {
        type: String,
    },
    summary: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    film: {
        type: String,
    },
    description: {
        type: String,
    },
    category_id: {
        type: schema.Types.ObjectId,
    },
    location: {
        type: String,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default documentModel