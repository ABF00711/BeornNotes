const mysqlDA = require("../Data_Access");

const tabInterfaceController = {
    getTabInterfaces: async (req, res) => {
        try {
            const {user} = req;

            const userData = await mysqlDA.getOneData("users", {name: user.name});
            if(!userData){
                console.log("User of this tabInterface is not existing");
                res.json({message: "User of this tabInterface is not existing"});
                return;
            }
            const tabInterfaces = await mysqlDA.getData("tab_interfaces", {user_id: userData.id});
            res.json({message: "getLayouts success", tabInterfaces});
        } catch (error) {
            console.log("getTabInterfacesError: ", error);
            res.json({message: "getTabInterfaces failed"});
        }
    },

    createTabInterface: async (req, res) => {
        try {
            const {tabInterfaceJson, tabInterfaceName} = req.body;
            const {user} = req;

            const userData = await mysqlDA.getOneData("users", {name: user.name});
            if(!userData){
                console.log("User of this tabInterface is not existing");
                res.json({message: "User of this tabInterface is not existing"});
                return;
            }
            const tabInterface = {user_id: userData.id, tabs_name: tabInterfaceName, tabs_json: tabInterfaceJson};
            await mysqlDA.create("tab_interfaces", tabInterface);
            res.json({message: "createTabInterface success"});
        } catch (error) {
            console.log("createTabInterfaceError: ", error);
            res.json({message: "createTabInterface failed"});
        }
    },

    updateTabInterface: async (req, res) => {
        try {
            const {tabInterfaceJson, tabInterfaceName} = req.body;
            const {user} = req;

            const userData = await mysqlDA.getOneData("users", {name: user.name});
            if(!userData){
                let errorMessage = "User of this tabInterface is not existing";
                console.log(errorMessage);
                res.json({message: errorMessage});
                return;
            }
            const existTabInterface = await mysqlDA.getOneData("tab_interfaces", {user_id: userData.id, tabs_name: tabInterfaceName});
            if(!existTabInterface){
                if(tabInterfaceName == "Default"){
                    await mysqlDA.create("tab_interfaces", {user_id: userData.id, tabs_name: "Default", tabs_json: tabInterfaceJson});
                    res.json({message: "updateTabInterface success"})
                    return;
                }
                console.log("TabInterface is not existing!");
                res.json({message: "TabInterface is not existing"});
                return;
            }
            existTabInterface.tabs_json = tabInterfaceJson;
            await mysqlDA.update("tab_interfaces", existTabInterface);
            res.json({message: "updateTabInterface success"});
        } catch (error) {
            console.log("updateTabInterfaceError: ", error);
            res.json({message: "updateTabInterface failed"})
        }
    },

    deleteTabInterface: async (req, res) => {
        try {
            const {id} = req.body;

            await mysqlDA.delete("tab_interfaces", id);
            res.json({message: "deleteTabInterface success"});
        } catch (error) {
            console.log("deleteTabInterfaceError: ", error);
        }
    }
}

module.exports = tabInterfaceController;