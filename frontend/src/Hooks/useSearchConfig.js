import { useContext } from "react";
import { MyContext } from "../Context";
import services from "../Services";

function useSearchConfig () {
    const {searchConfig, setSearchConfig} = useContext(MyContext);

    const getSearchConfigData = async () => {
        console.log("getSearchConfigData is called!")
        try {
            const res = await services.getSearchConfig();
            if(res.message == "getSearchConfigData success"){
                setSearchConfig(res.searchConfigData);
            }
        } catch (error) {
            console.log("getSearchConfigDataError: ", error)   
        }
    }

    return (
        {searchConfig, getSearchConfigData}
    );
}

export default useSearchConfig;