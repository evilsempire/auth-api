import mongoose, { Schema } from "mongoose";

const dataSchema: Schema = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String,
    },
    date_added: {
		type: Date,
		default: Date.now
	},
    date_updated: {
		type: Date,
		default: Date.now
	},
})

module.exports = mongoose.model('users', dataSchema)