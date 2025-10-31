const mysqlDA = require("../Data_Access");

const gridStateController = {
    create: async(req, res) => {
        try {
            const user = req.user;
            const {state} = req.body;
            const userData = await mysqlDA.getOneData("users", {name: user.name});
            if(!userData){
                console.log("User of this pattern is not existing");
                res.json({message: "User of this pattern is not existing"});
                return;
            }
            const isStateExist = await mysqlDA.getOneData("gridState", {userId: userData.id});
            if(!isStateExist){
                await mysqlDA.create("gridState", {userId: userData.id, state});
            }else{
                isStateExist.state = state;
                await mysqlDA.update("gridState", isStateExist);
            }
            res.json({message: "createGridState success"});
        } catch (error) {
            console.log('createGridState: ', error);
            res.json({message: "createGridState failed"})
        }
    },

    get: async (req, res) => {
        try {
            const user = req.user;
            const userData = await mysqlDA.getOneData("users", {name: user.name});
            if(!userData){
                console.log("User of this pattern is not existing");
                res.json({message: "User of this pattern is not existing"});
                return;
            }
            const state = await mysqlDA.getOneData("gridState", {userId: userData.id});
            res.json({message: "getGridState success", state});
        } catch (error) {
            console.log("getGridStateError: ", error);
            res.json({message: "getGridState failed"});
        }
    }
}

module.exports = gridStateController;