import { useContext } from "react"
import { MyContext } from "../Context"
import services from "../Services";

function useDynamicData () {
    const {dynamicData, setDynamicData} = useContext(MyContext);

    const getDynamicData = async (tableView) => {
        try {
            console.log("tableView: ", tableView);
            const res = await services.getDynamicData(tableView);
            if(res.messsage = "getDynamicData success"){
                setDynamicData(res.dynamicData);
            }
        } catch (error) {
            console.log("getDynamicDataError: ", error);
        }
    }

    return (
        {dynamicData, getDynamicData}
    );
}

export default useDynamicData;