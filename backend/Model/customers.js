const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: String,
    display_name: String,
    job: String,
    birthday: Date,
    age: Number,
    active:Boolean
})

const customerDB = mongoose.model('customers', customerSchema);

module.exports = customerDB