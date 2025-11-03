import { useContext } from "react";
import { MyContext } from "../Context";
import services from "../Services";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function useTabbedInterfaces() {
    const { setTabbedInterfaces, currentInterface, setCurrentInterface } = useContext(MyContext);
    const navigate = useNavigate();

    const addTabbedInterface = (newItem) => {
        try {
            const tabbedInterface = { ...currentInterface, activeUrl: newItem.path };
            if (!tabbedInterface.tabbedBtns.some((btn) => btn.title == newItem.title)) {
                tabbedInterface.tabbedBtns.push(newItem);
            }
            localStorage.setItem("currentInterface", JSON.stringify(tabbedInterface));
            setCurrentInterface(tabbedInterface);
        } catch (error) {
            console.log("addTabbedInterfaceError: ", error);
        }
    }

    const removeTabbedInterface = (btnInfo) => {
        try {
            const currentTabbedUrl = JSON.parse(localStorage.getItem("currentInterface") || null).activeUrl;
            let nextActiveUrl = currentTabbedUrl;
            
            const targetTabIndex = currentInterface.tabbedBtns.findIndex(btns => btns.title == btnInfo.title);
            if(btnInfo.path == currentTabbedUrl){
                const nextTabBtn = currentInterface.tabbedBtns[targetTabIndex - 1];
                if (nextTabBtn) {
                    nextActiveUrl = nextTabBtn.path;
                }
            }
            const tabbedInterface = {
                ...currentInterface,
                tabbedBtns: currentInterface.tabbedBtns.filter((btn) => btn.title !== btnInfo.title),
                activeUrl: nextActiveUrl
            };
            localStorage.setItem("currentInterface", JSON.stringify(tabbedInterface));
            setCurrentInterface(tabbedInterface);
            navigate(nextActiveUrl);
        } catch (error) {
            console.log("removeTabbedInterfacesError: ", error);
        }
    }

    const getTabInterfaces = async () => {
        try {
            const res = await services.getTabInterfaces();
            if (res.message == "getTabInterfaces success") {
                setTabbedInterfaces(res.tabInterfaces);
                return;
            }
            // toast.error(res.message);
        } catch (error) {
            console.log("getTabInterfacesError: ", error);
        }
    }

    const createTabInterfaces = async (tabInterfaceName, tabInterfaceJson) => {
        try {
            const res = await services.createTabInterface(tabInterfaceName, tabInterfaceJson);
            if (res.message == "createTabInterface success") {
                toast.success("Created a new tab interface successfully");
                await getTabInterfaces();
                return;
            }
            toast.error(res.message);
        } catch (error) {
            console.log("createTabInterfaceError: ", error);
        }
    }


    const updateTabInterfaces = async (tabInterfaceName, tabInterfaceJson) => {
        try {
            const res = await services.updateTabInterface(tabInterfaceName, tabInterfaceJson);
            if (res.message == "updateTabInterface success") {
                getTabInterfaces();
                toast.success("Updated the tab interface successfully");
                return;
            }
            toast.error(res.message);
        } catch (error) {
            console.log("updateTabInterfaceError: ", error);
        }
    }

    const deleteTabInterfaces = async (tabInterfaceId) => {
        try {
            const res = await services.deleteTabInterface(tabInterfaceId);
            if (res.message == "deleteTabInterface success") {
                getTabInterfaces();
                toast.success("Deleted the tab interface successfully");
                return;
            }
            toast.error(res.message);
        } catch (error) {
            console.log("deleteTabInterfaceError: ", error);
        }
    }

    const getCurrentTabInterface = async () => {
        try {
            const res = await services.getTabInterfaces();
            if (res.message == "getTabInterfaces success") {
                setTabbedInterfaces(res.tabInterfaces);
                const savedCurrentInterface = JSON.parse(localStorage.getItem("currentInterface") || null);
                if (savedCurrentInterface) {
                    setCurrentInterface(savedCurrentInterface);
                    navigate(savedCurrentInterface.activeUrl);
                    return;
                }   
                const defaultInterface = res.tabInterfaces.find((tInterface) => tInterface.tabs_name == "Default");
                if (defaultInterface) {
                    const interfaceData = JSON.parse(defaultInterface.tabs_json);
                    setCurrentInterface(interfaceData);
                    navigate(interfaceData.activeUrl);
                    localStorage.setItem("currentInterface", defaultInterface.tabs_json);
                    return;
                }
                navigate("/");
                return;
            }
            navigate("/login");
        } catch (error) {
            console.log('getCurrentTabInterfaceError: ', error);
            localStorage.setItem("currentInterface", "");
            navigate("/");
        }
    }

    return (
        {
            addTabbedInterface,
            removeTabbedInterface, currentInterface,
            getTabInterfaces, createTabInterfaces,
            updateTabInterfaces, deleteTabInterfaces,
            getCurrentTabInterface
        }
    );
}

export default useTabbedInterfaces;