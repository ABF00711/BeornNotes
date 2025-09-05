const customerDB = require("../Model/customers.js");
const UserDB = require("../Model/user.js");
const DataAccess = require("./data_access.js");

const userDA = new DataAccess(UserDB);
const customerDA = new DataAccess(customerDB);

module.exports = {
    userDA,
    customerDA
}