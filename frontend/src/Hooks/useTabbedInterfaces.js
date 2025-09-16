import { useContext, useEffect } from "react";
import { MyContext } from "../Context";

function useTabbedInterfaces () {
    const {tabbedInterfaces, setTabbedInterfaces} = useContext(MyContext);

    const getTabbedInterface = () => {
        try {
            const tabbedInterface = localStorage.getItem("tabbedInterface");
            
            if(!tabbedInterface) {
                return {tabbedBtns: [], activeUrl: {}}
            }
            const parsedInterface = JSON.parse(tabbedInterface);
            return parsedInterface;
        } catch (error) {
            console.log("getTabbedInterfaceError: ", error);
            return {tabbedBtns: [], activeUrl: {}};
        }
    }

    const addTabbedInterface = (newItem) => {
        try {
            const tabbedInterface = getTabbedInterface();
            if (!tabbedInterface.tabbedBtns.some((btn) => btn.title == newItem.title)){
                tabbedInterface.tabbedBtns.push(newItem);
            }
            tabbedInterface.activeUrl = newItem.path;
            localStorage.setItem("tabbedInterface", JSON.stringify(tabbedInterface));
        } catch (error) {
            console.log("addTabbedInterfaceError: ", error);
        }
    }

    const removeTabbedInterface = (btnInfo) => {
        try {
            const tabbedInterface = getTabbedInterface();
            const _tabbedBtns = tabbedInterface.tabbedBtns.filter(btn => btn.title !== btnInfo.title);
            tabbedInterface.tabbedBtns = _tabbedBtns;
            tabbedInterface.activeUrl = "/";
            localStorage.setItem("tabbedInterface", JSON.stringify(tabbedInterface));
        } catch (error) {
            console.log("removeTabbedInterfacesError: ", error);
        }
    }

    const goToActiveUrl = (onNavigate) => {
        try {
            const tabbedInterface = localStorage.getItem("tabbedInterface");
            if(tabbedInterface){
                const activeUrl = JSON.parse(tabbedInterface).activeUrl;
                if(activeUrl){
                    onNavigate(activeUrl);
                    return;
                }
            }
            onNavigate("/");
        } catch (error) {
            console.log("goToActiveUrlError: ", error);
        }
    }

    return (
        {addTabbedInterface, getTabbedInterface, removeTabbedInterface, goToActiveUrl}
    );
}

export default useTabbedInterfaces;