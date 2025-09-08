const app = require("./app");
const configs = require("./Config/index.js");

app.listen(configs.serverPort, () => {
    console.log(`Server is running at ${configs.serverPort}`);
})