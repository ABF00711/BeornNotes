const mysqlDA = require("../Data_Access");

const dynamicDataController = {
    getDynamicData: async (req, res) => {
        try {
            const {tableView} = req.body;
            
            const formData = await mysqlDA.getOneData("forms", {tableView});
            if(!formData){
                res.json({message: "No existing form data"});
                return;
            }
            const sql = `Select ${formData.Select} From ${formData.TableView} Where ${formData.WhereClause} Order By ${formData.OrderBy}`
            const dynamicData = await mysqlDA.excuteSql(sql);
            res.json({message: "getDynamicData success", dynamicData});
        } catch (error) {
            console.log("getDynamicDataError: ", error);
            res.json({message: "getDynamicData failed"});
        }
    },

    createDynamicData: async (req, res) => {
        try {
            const {tablename, newData} = req.body;
            newData.active = 1;
            const newDataId = await mysqlDA.create(tablename, newData);
            res.json({message: "createDynamicData success", newDataId});
        } catch (error) {
            console.log("createDynamicDataError: ", error);
            res.json({message: "createDynamicData failed"});
        }
    },

    updateDynamicData: async (req, res) => {
        try {
            const {tablename, newData} = req.body;
            await mysqlDA.update(tablename, newData);
            res.json({message: "updateDynamicData success"});
        } catch (error) {
            console.log("updateDynamicDataError: ", error);
            res.json({message: "updateDynamicData failed"});
        }
    }
}

module.exports = dynamicDataController;