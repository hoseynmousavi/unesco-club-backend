import mongoose from "mongoose"

const schema = mongoose.Schema

const adminModel = new schema({
    name: {
        type: String,
        required: "Enter name!",
    },
    username: {
        type: String,
        required: "Enter username!",
    },
    password: {
        type: String,
        minLength: 6,
        required: "Enter password!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default adminModel