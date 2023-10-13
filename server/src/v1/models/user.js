const mongoose = require("mongoose");
const { schemaOptions } = require("./modelOptions");

const userSchema = new mongoose.Schema({
    username: {
        trype: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    }
}, schemaOptions)

module.exports = mongoose.model('User', userSchema);