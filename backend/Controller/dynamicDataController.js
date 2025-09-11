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
            console.log("getDynamicData: ", error);
            res.json({message: "getDynamicData failed"});
        }
    }
}

module.exports = dynamicDataController;