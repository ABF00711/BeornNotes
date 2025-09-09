import { useContext } from "react";
import { MyContext } from "../Context";


function useMenuItems () {
    const {menuItems, setMenuItems} = useContext(MyContext);

    const getMenuItems = async () => {
        try {
            
        } catch (err) {
            console.log("getMenuItemsError: ", err);
        }        
    }

    return (
        {getMenuItems, menuItems}
    );
}

export default useMenuItems;