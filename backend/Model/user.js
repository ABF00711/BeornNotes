const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    hashedPassword: String
})

const UserDB = mongoose.model('users', userSchema);

module.exports = UserDB