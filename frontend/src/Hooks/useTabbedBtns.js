import { useContext } from "react";
import { MyContext } from "../Context";

function useTabbedBtns () {
    const {tabbedBtns, setTabbedBtns} = useContext(MyContext);

    const addTabbedBtns = (item) => {
        try {
            if (tabbedBtns.indexOf((btn) => btn.title == item.title)){
                let _tabbedBtns = [...tabbedBtns];
                _tabbedBtns.push(item);
                setTabbedBtns(_tabbedBtns);
            }
        } catch (error) {
            console.log("addTabbedBtnsError: ", error);
        }
    }

    return (
        {tabbedBtns, addTabbedBtns}
    );
}

export default useTabbedBtns;