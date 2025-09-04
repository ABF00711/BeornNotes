const customerDB = require("../Model/customers");
const UserDB = require("../Model/User");
const DataAccess = require("./data_access");

const userDA = new DataAccess(UserDB);
const customerDA = new DataAccess(customerDB);

module.exports = {
    userDA,
    customerDA
}