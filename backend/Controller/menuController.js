const mysqlDA = require("../Data_Access");

const menuController = {
    getMenuItems: async (req, res) => {
        try {
            const {user} = req;
            const userWithID = await mysqlDA.getOneData("users", {name: user.name});
            const user_role = await mysqlDA.getOneData("user_roles", {user_id: userWithID.id});
            let role_id;
            if(user_role == null){
                role_id = 1;
            }else{
                role_id = user_role.role_id;
            }
            const menu_role = await mysqlDA.getData("menu_roles", {role_id});
            console.log("user_menu: ", menu_role);
            const menu = await mysqlDA.getAllData("menu");
            const user_menu = menu.filter((item) => {
                if(menu_role.find((value) => value.menu_id == item.id)){
                    return true;
                }
            })
            res.json({message: "getMenuItems success", user_menu});
        } catch (error) {
            console.log("getMenuItemsError: ", error);
            res.json({message: "getMenuItem failed!"});
        }
    }
}

module.exports = menuController