import mongoose from "mongoose"

const schema = mongoose.Schema

const categoryModel = new schema({
    name: {
        type: String,
        required: "Enter name!",
    },
    description: {
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