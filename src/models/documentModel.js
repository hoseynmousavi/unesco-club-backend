import mongoose from "mongoose"

const schema = mongoose.Schema

const documentModel = new schema({
    title: {
        type: String,
    },
    title_en: {
        type: String,
    },
    summary: {
        type: String,
    },
    summary_en: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    description: {
        type: String,
    },
    description_en: {
        type: String,
    },
    location: {
        type: String,
    },
    location_en: {
        type: String,
    },
    is_route: {
        type: Boolean,
        default: false,
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