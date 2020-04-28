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
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default documentModel