import { useContext, useEffect } from "react";
import { MyContext } from "../Context";

function useTabbedInterfaces () {
    const {tabbedInterfaces, setTabbedInterfaces, currentInterface, setCurrentInterface} = useContext(MyContext);

    const getTabbedInterface = () => {
        try {
            const tabbedInterface = localStorage.getItem("tabbedInterface");
            
            if(!tabbedInterface) {
                return {tabbedBtns: [], activeUrl: {}}
            }
            const parsedInterface = JSON.parse(tabbedInterface);
            setCurrentInterface(parsedInterface);
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
            setCurrentInterface(tabbedInterface);
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
            setCurrentInterface(tabbedInterface);
        } catch (error) {
            console.log("removeTabbedInterfacesError: ", error);
        }
    }
    return (
        {addTabbedInterface, getTabbedInterface, removeTabbedInterface, currentInterface}
    );
}

export default useTabbedInterfaces;