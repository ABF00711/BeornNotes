const { mysqlDB } = require("../MySql");
const DataAccess = require("./data_access");

const mysqlDA = new DataAccess(mysqlDB);

module.exports = mysqlDA