const mysql = require("mysql2");
const config = require("../Config");

const mysqlDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "beornnotes"
})

const connectDB = async() => {
    try {
        mysqlDB.connect();
        console.log("Connected to MySql successfull!");
    } catch (error) {
        console.log("Error connecting to MySql: ", error);
    }
}

module.exports = {
    connectDB,
    mysqlDB
}