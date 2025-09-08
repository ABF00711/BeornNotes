import { useContext } from "react";
import { MyContext } from "../Context";
import services from "../Services";

function useSearchConfig () {
    const {searchConfig, setSearchConfig} = useContext(MyContext);

    const getSearchConfigData = async () => {
        try {
            const res = await services.getSearchConfig();
            if(res.searchConfigData){
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