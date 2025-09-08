const mysql = require("mysql2/promise");
const config = require("../Config");

const mysqlDB = mysql.createPool(config.mysqlServer)

module.exports = {
    mysqlDB
}