const mysqlDA = require("../Data_Access");

const searchConfigController = {
    getAll: async (req, res) => {
        try {
            const searchConfigData = await mysqlDA.getAllData("search_config");
            if(!searchConfigData) throw new Error({message:"searchConfigData is not existing!"});
            
            res.json({message: "getSearchConfigData success", searchConfigData});
        } catch (error) {
            console.log("getSearchConfigDataError: ", error);
            res.json(error);
        }
    }
}

module.exports = searchConfigController;