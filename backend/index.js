const app = require("./app");
const configs = require("./Config");
const connectDB = require("./Mongodb");

connectDB();
app.listen(configs.serverPort, () => {
    console.log(`Server is running at ${configs.serverPort}`);
})