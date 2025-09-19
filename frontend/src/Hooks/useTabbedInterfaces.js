import { useContext, useEffect } from "react";
import { MyContext } from "../Context";
import services from "../Services";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function useTabbedInterfaces() {
    const { tabbedInterfaces, setTabbedInterfaces, currentInterface, setCurrentInterface } = useContext(MyContext);
    const navigate = useNavigate();

    const getCurrentTabInterface = () => {
        try {
            const tabbedInterface = localStorage.getItem("tabbedInterface");

            if (!tabbedInterface) {
                return { tabbedBtns: [], activeUrl: {} }
            }
            const parsedInterface = JSON.parse(tabbedInterface);
            setCurrentInterface(parsedInterface);
        } catch (error) {
            console.log("getCurrentTabInterfaceError: ", error);
            return { tabbedBtns: [], activeUrl: {} };
        }
    }

    const addTabbedInterface = (newItem) => {
        try {
            const tabbedInterface = { ...currentInterface, activeUrl: newItem.path };
            if (!tabbedInterface.tabbedBtns.some((btn) => btn.title == newItem.title)) {
                tabbedInterface.tabbedBtns.push(newItem);
            }
            localStorage.setItem("tabbedInterface", JSON.stringify(tabbedInterface));
            setCurrentInterface(tabbedInterface);
        } catch (error) {
            console.log("addTabbedInterfaceError: ", error);
        }
    }

    const removeTabbedInterface = (btnInfo) => {
        try {
            const currentTabIndex = currentInterface.tabbedBtns.findIndex(btns => btns.title == btnInfo.title);
            const nextTabBtn = currentInterface.tabbedBtns[currentTabIndex - 1];
            let nextActiveUrl = "/";
            if(nextTabBtn){
                nextActiveUrl = nextTabBtn.path;
            }
            const tabbedInterface = {
                ...currentInterface,
                tabbedBtns: currentInterface.tabbedBtns.filter((btn) => btn.title !== btnInfo.title),
                activeUrl: nextActiveUrl
            };
            localStorage.setItem("tabbedInterface", JSON.stringify(tabbedInterface));
            setCurrentInterface(tabbedInterface);
            navigate(nextActiveUrl);
        } catch (error) {
            console.log("removeTabbedInterfacesError: ", error);
        }
    }

    const getTabInterfaces = async () => {
        try {
            const res = await services.getTabInterfaces();
            if (res.message == "getLayouts success") {
                setTabbedInterfaces(res.tabInterfaces);
                return;
            }
            toast.error(res.message);
        } catch (error) {
            console.log("getTabInterfacesError: ", error);
        }
    }

    const createTabInterfaces = async (tabInterfaceName, tabInterfaceJson) => {
        try {
            const res = await services.createTabInterface(tabInterfaceName, tabInterfaceJson);
            if (res.message == "createTabInterface success") {
                getTabInterfaces();
                toast.success("Created a new tab interface successfully");
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

    return (
        {
            addTabbedInterface, getCurrentTabInterface,
            removeTabbedInterface, currentInterface,
            getTabInterfaces, createTabInterfaces,
            updateTabInterfaces, deleteTabInterfaces
        }
    );
}

export default useTabbedInterfaces;