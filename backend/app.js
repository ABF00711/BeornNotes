const express = require("express");
const cors = require("cors");
const router = require("./Route/index.js");

const app = express()

app.use(cors());
app.use(express.json());
app.options('*', cors());
app.use('/api', router);

module.exports = app;