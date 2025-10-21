const mysqlDA = require("../Data_Access");

const dynamicDataController = {
    getDynamicData: async (req, res) => {
        try {
            const {formName} = req.body;
            
            const formData = await mysqlDA.getOneData("forms", {FormName: formName});
            if(!formData){
                res.json({message: "No existing form data"});
                return;
            }
            const sql = `${formData.Select} ${formData.WhereClause ? 'Where ' + formData.WhereClause : ''} ${formData.OrderBy ? 'Order By ' + formData.OrderBy : ''}`
            const dynamicData = await mysqlDA.excuteSql(sql);
            res.json({message: "getDynamicData success", dynamicData, tablename: formData.TableView});
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
    },

    deleteDynamicData: async (req, res) => {
        try {
            const {tablename, selectedRows} = req.body;
            const selectedRowIds = selectedRows.map((item) => item.id);
            const sql = `Delete From ${tablename} Where id In (${selectedRowIds.join(", ")})`;
            await mysqlDA.excuteSql(sql);
            res.json({message: "deleteDynamicData success"});
        } catch (error) {
            console.log("deleteDynamicDataError: ", error);
            res.json({message: "deleteDynamicData failed"});
        }
    }
}

module.exports = dynamicDataController;