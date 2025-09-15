import services from "../Services";
import { toast } from "react-toastify";
import {useContext} from "react";
import { MyContext } from "../Context";

function useSearchpatterns () {
    const {searchpatterns, setSearchpatterns} = useContext(MyContext);

    const getSearchpatterns = async(tablename) => {
        try {
            const res = await services.getSearchpatterns(tablename);
            if(res.message == "getSearchpatterns success"){
                setSearchpatterns(res.searchpatterns);
            }
        } catch (error) {
            console.log("getSearchpatternsError: ", error);
        }
    }

    const updateSearchpatterns = async(searchData, searchName, tablename) => {
        try {
            const res = await services.updateSearchpatterns(searchData, searchName, tablename);
            if(res.message == "updateSearchpatterns success"){
                toast.success("Update searchpatterns success");
                getSearchpatterns();
            }
        } catch (error) {
            console.log("updateSearchpatternsError: ", error);
        }
    }

    const createSearchpatterns = async(searchData, searchName, tablename) => {
        try {
            const res = await services.createSearchpatterns(searchData, searchName, tablename);
            if(res.message == "createSearchpatterns success"){
                toast.success("Create searchpatterns success");
                getSearchpatterns();
            }
        } catch (error) {
            console.log("createSearchpatternsError: ", error);
        }
    }

    const deleteSearchpatterns = async(filterId) => {
        try {
            const res = await services.deleteSearchpatterns(filterId);
            if(res.message == "deleteSearchpatterns success"){
                getSearchpatterns();
                toast.success("Delete searchpatterns success");
            }
        } catch (error) {
            console.log("deleteSearchpatternsError: ", error);
        }
    }

    return ({
        getSearchpatterns, searchpatterns, updateSearchpatterns, createSearchpatterns, deleteSearchpatterns
    })
}

export default useSearchpatterns;