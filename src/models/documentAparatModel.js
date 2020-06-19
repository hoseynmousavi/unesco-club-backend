import mongoose from "mongoose"

const schema = mongoose.Schema

const documentAparatModel = new schema({
    document_id: {
        type: schema.Types.ObjectId,
    },
    description: {
        type: String,
    },
    description_en: {
        type: String,
    },
    link: {
        type: String,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default documentAparatModel