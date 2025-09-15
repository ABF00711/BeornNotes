const mysqlDA = require("../Data_Access");

const layoutsController = {
    getLayouts: async (req, res) => {
        try {
            const {user} = req;
            const {tablename} = req.body;

            const userData = await mysqlDA.getOneData("users", {name: user.name});
            if(!userData){
                console.log("User of this pattern is not existing");
                res.json({message: "User of this pattern is not existing"});
                return;
            }
            const allLayouts = await mysqlDA.getData("grid_layouts", {user_id: userData.id});
            const layouts = allLayouts.filter(filter => filter.table_name == tablename);
            res.json({message: "getLayouts success", layouts});
        } catch (error) {
            console.log("getLayoutsError: ", error);
            res.json({message: "getLayouts failed"});
        }
    },

    createLayouts: async (req, res) => {
        try {
            const {layoutJson, layoutName, tablename} = req.body;
            const {user} = req;

            const userData = await mysqlDA.getOneData("users", {name: user.name});
            if(!userData){
                console.log("User of this pattern is not existing");
                res.json({message: "User of this pattern is not existing"});
                return;
            }
            const layout = {table_name: tablename, user_id: userData.id, layout_name: layoutName, layout_json: layoutJson};
            await mysqlDA.create("grid_layouts", layout);
            res.json({message: "createLayouts success"})
        } catch (error) {
            console.log("createLayoutsError: ", error);
            res.json({message: "createLayouts failed"})
        }
    },
    
    updateLayouts: async (req, res) => {
        try {
            const {layoutJson, layoutName, tablename} = req.body;
            const {user} = req;

            const userData = await mysqlDA.getOneData("users", {name: user.name});
            if(!userData){
                let errorMessage = "User of this layout is not existing";
                console.log(errorMessage);
                res.json({message: errorMessage});
                return;
            }
            const existLayout = await mysqlDA.getOneData("grid_layouts", {user_id: userData.id, layout_name: layoutName, table_name: tablename});
            if(!existLayout){
                if(layoutName == "Default"){
                    await mysqlDA.create("grid_layouts", {table_name: tablename, user_id: userData.id, layout_name: "Default", layout_json: layoutJson});
                    res.json({message: "updateLayouts success"})
                    return;
                }
                console.log("Layout is not existing!");
                res.json({message: "Layout is not existing"});
                return;
            }
            existLayout.layout_json = layoutJson;
            await mysqlDA.update("grid_layouts", existLayout);
            res.json({message: "updateLayouts success"});
        } catch (error) {
            console.log("updateLayoutsError: ", error);
            res.json({message: "updateLayouts failed"})
        }
    },

    deleteLayouts: async (req, res) => {
        try {
            const {id} = req.body;

            await mysqlDA.delete("grid_layouts", id);
            res.json({message: "deleteLayouts success"});
        } catch (error) {
            console.log("deleteLayoutsError: ", error);
            res.json({message: "deleteLayouts failed"})
        }
    }
}

module.exports = layoutsController