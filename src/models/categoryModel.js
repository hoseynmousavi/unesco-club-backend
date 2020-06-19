import mongoose from "mongoose"

const schema = mongoose.Schema

const categoryModel = new schema({
    name: {
        type: String,
        required: "Enter name!",
    },
    name_en: {
        type: String,
        required: "Enter name_en!",
    },
    description: {
        type: String,
    },
    description_en: {
        type: String,
    },
    picture: {
        type: String,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default categoryModel