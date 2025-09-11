const mysqlDA = require("../Data_Access");

const dynamicDataController = {
    getDynamicData: async (req, res) => {
        try {
            const {tableName} = req.body;
            const dynamicData = await mysqlDA.getAllData(tableName);
            res.json({message: "getDynamicData success", dynamicData});
        } catch (error) {
            console.log("getDynamicData: ", error);
            res.json({message: "getDynamicData failed"});
        }
    }
}

module.exports = dynamicDataController;