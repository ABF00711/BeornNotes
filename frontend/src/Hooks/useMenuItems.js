import { useContext } from "react";
import { MyContext } from "../Context";
import services from "../Services";


function useMenuItems() {
    const { menuItems, setMenuItems, token } = useContext(MyContext);

    const getMenuItems = async () => {
        try {
            const res = await services.getMenuItems(token);
            if (res.message == "getMenuItems success") {
                let _menuItems = [{
                    id: 0,
                    screen_id: "dashboard",
                    title: "Dashboard",
                    icon: "📊",
                    path: "/",
                    active: "",
                    parent_id: null
                }];
                setMenuItems(_menuItems.concat(res.user_menu));
            }
        } catch (err) {
            console.log("getMenuItemsError: ", err);
        }
    }

    return (
        { getMenuItems, menuItems }
    );
}

export default useMenuItems;