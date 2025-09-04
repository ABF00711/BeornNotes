const express = require("express");
const cors = require("cors");
const router = require("./Route");

const app = express()

app.use(cors({
    origin: ["*"],
}));
app.use(express.json());
app.use('/api', router);
app.options('*', cors());

module.exports = app;