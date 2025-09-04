const mongoose = require("mongoose");
const config = require("../Config");

const connectDB = async() => {
    try {
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Connected to MongoDB successfull!");
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error);
    }
}

module.exports = connectDB