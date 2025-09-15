import { useContext, useEffect } from "react";
import { MyContext } from "../Context";

function useTabbedBtns () {
    const {tabbedBtns, setTabbedBtns} = useContext(MyContext);

    const addTabbedBtns = (item) => {
        try {
            if (!tabbedBtns.some((btn) => btn.title == item.title)){
                let _tabbedBtns = [...tabbedBtns, item];
                localStorage.setItem("tabbedBtns", JSON.stringify(_tabbedBtns));
                setTabbedBtns(_tabbedBtns);
            }
        } catch (error) {
            console.log("addTabbedBtnsError: ", error);
        }
    }

    const getTabbedBtns = () => {
        try {
            const btnInfo = localStorage.getItem("tabbedBtns");
            
            if(!btnInfo) {
                setTabbedBtns([]); 
                return;
            }
            const parse = JSON.parse(btnInfo);
            setTabbedBtns(parse);
        } catch (error) {
            console.log("getTabbedBtnsError: ", error);
            setTabbedBtns([]);
        }
    }

    const removeTabbedBtn = (btnInfo) => {
        try {
            let _tabbedBtns = [...tabbedBtns];
            _tabbedBtns = _tabbedBtns.filter(item => item.title !== btnInfo.title);
            console.log("_tabbedBtns: ", _tabbedBtns);
            setTabbedBtns(_tabbedBtns);
            localStorage.setItem("tabbedBtns", JSON.stringify(_tabbedBtns));
        } catch (error) {
            console.log("removeTabbedBtnsError: ", error);
            setTabbedBtns([]);
        }
    }

    return (
        {tabbedBtns, addTabbedBtns, getTabbedBtns, removeTabbedBtn}
    );
}

export default useTabbedBtns;