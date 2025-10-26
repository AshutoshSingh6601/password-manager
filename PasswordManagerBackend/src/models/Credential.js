import mongoose from "mongoose";

const credentials = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    websiteURL: {
        type: String
    },
    websiteName: {
        type: String
    },
    email: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    iv: {
        type: String,
    }
})

export default mongoose.model('Credential', credentials)