import { useContext } from "react";
import { MyContext } from "../Context";
import services from "../Services";


function useMenuItems () {
    const {menuItems, setMenuItems} = useContext(MyContext);

    const getMenuItems = async () => {
        try {
            const res = await services.getMenuItems();
            if(res.message == "getMenuItems success"){
                setMenuItems(res.user_menu);
            }
        } catch (err) {
            console.log("getMenuItemsError: ", err);
        }        
    }

    return (
        {getMenuItems, menuItems}
    );
}

export default useMenuItems;