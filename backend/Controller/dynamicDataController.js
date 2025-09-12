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
            await mysqlDA.create(tablename, newData);
            res.json({message: "createDynamicData success"});
        } catch (error) {
            console.log("createDynamicDataError: ", error);
            res.json({message: "createDynamicData failed"});
        }
    }
}

module.exports = dynamicDataController;