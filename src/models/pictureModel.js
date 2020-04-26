import mongoose from "mongoose"

const schema = mongoose.Schema

const pictureModel = new schema({
    document_id: {
        type: schema.Types.ObjectId,
    },
    file: {
        type: String,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default pictureModel