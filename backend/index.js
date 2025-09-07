const app = require("./app");
const configs = require("./Config/index.js");
const { connectDB } = require("./MySql/index.js");

connectDB();
app.listen(configs.serverPort, () => {
    console.log(`Server is running at ${configs.serverPort}`);
})