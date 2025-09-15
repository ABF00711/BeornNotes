const mysqlDA = require("../Data_Access");

const filterController = {
    getSearchpatterns: async (req, res) => {
        try {
            const {user} = req;
            const {tablename} = req.body;

            const allSearchpatterns = await mysqlDA.getData("searchpatterns", {user_name: user.name});
            const searchpatterns = allSearchpatterns.filter(filter => filter.table_name == tablename);
            res.json({message: "getSearchpatterns success", searchpatterns})
        } catch (error) {
            console.log("getSearchpatternsError: ", error);
            res.json({message: "getSearchpatterns failed"});
        }
    },

    createSearchpatterns: async (req, res) => {
        try {
            const {searchData, searchName, tablename} = req.body;
            const {user} = req;
            const searchpattern = {table_name: tablename, user_name: user.name, name: searchName, data: searchData};
            await mysqlDA.create("searchpatterns", searchpattern);
            res.json({message: "createSearchpatterns success"})
        } catch (error) {
            console.log("createSearchpatternsError: ", error);
            res.json({message: "createSearchpatterns failed"})
        }
    },
    
    updateSearchpatterns: async (req, res) => {
        try {
            const {searchData, searchName, tablename} = req.body;
            const {user} = req;
            const existSearchPattern = await mysqlDA.getOneData("searchpatterns", {user_name: user.name, name: searchName, table_name: tablename});
            if(!existSearchPattern){
                if(searchName == "Default"){
                    await mysqlDA.create("searchpatterns", {table_name: tablename, user_name: user.name, name: "Default", data: searchData});
                    res.json({message: "updateSearchpatterns success"})
                }
                console.log("searchPattern is not existing!");
                res.json({message: "searchPattern is not existing"});
                return;
            }
            existSearchPattern.data = searchData;
            await mysqlDA.update("searchpatterns", existSearchPattern);
            res.json({message: "updateSearchpatterns success"});
        } catch (error) {
            console.log("updateSearchpatternsError: ", error);
            res.json({message: "updateSearchpatterns failed"})
        }
    }
}

module.exports = filterController