import mongoose from "mongoose"

const schema = mongoose.Schema

const documentCategoryModel = new schema({
    document_id: {
        type: schema.Types.ObjectId,
        required: "Enter document_id!",
    },
    category_id: {
        type: schema.Types.ObjectId,
        required: "Enter category_id!",
    },
})

documentCategoryModel.index({document_id: 1, category_id: 1}, {unique: true})

export default documentCategoryModel