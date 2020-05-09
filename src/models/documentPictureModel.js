import mongoose from "mongoose"

const schema = mongoose.Schema

const documentPictureModel = new schema({
    document_id: {
        type: schema.Types.ObjectId,
    },
    description: {
        type: String,
    },
    file: {
        type: String,
    },
    slider: {
        type: Boolean,
        default: false,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default documentPictureModel