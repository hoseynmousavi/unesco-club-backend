import mongoose from "mongoose"

const schema = mongoose.Schema

const userModel = new schema({
    is_verified: {
        type: Boolean,
        default: false,
    },
    have_tick: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        unique: true,
        minlength: 11,
        maxlength: 11,
        index: true,
        required: "Enter phone!",
    },
    phone_verified: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        unique: true,
        required: "Enter email!",
    },
    email_verified: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        required: "Enter name!",
    },
    major: {
        type: String,
    },
    grade: {
        type: String,
        required: "Enter grade!",
    },
    university: {
        type: String,
    },
    birth_date_year: {
        type: Number,
        min: 1300,
        max: 1400,
    },
    avatar: {
        type: String,
    },
    range_of_activity: {
        type: String,
    },
    specializations: {
        type: String,
    },
    familiarity_with_language: {
        type: String,
        enum: ["low", "average", "high"],
        required: "Enter familiarity_with_language!",
    },
    familiarity_with_area: {
        type: String,
        enum: ["low", "average", "high"],
        required: "Enter familiarity_with_area!",
    },
    familiarity_with_tourism: {
        type: String,
        enum: ["low", "average", "high"],
        required: "Enter familiarity_with_tourism!",
    },
    experience: {
        type: String,
    },
    current_organ: {
        type: String,
    },
    instagram: {
        type: String,
    },
    description: {
        type: String,
        required: "Enter description!",
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

export default userModel