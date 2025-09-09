const mysqlDA = require("../Data_Access");

const optionDataController = {
    getAll: async (req, res) => {
        try {
            const {lookup_sql} = req.body;
            console.log("optionData: ", lookup_sql);
            const optionData = await mysqlDA.excuteSql(lookup_sql);
            res.json({message: "getOptionData success", optionData});
        } catch (error) {
            console.log("getAllError: ", error);
            res.status(200).json({message: "getOptionData failed"})
        }
    },

}

module.exports = optionDataController;