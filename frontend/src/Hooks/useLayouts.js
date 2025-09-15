import { useContext } from "react";
import { MyContext } from "../Context";
import services from "../Services";
import { toast } from "react-toastify";

function useLayouts () {
    const {layouts, setLayouts} = useContext(MyContext);

    const getLayouts = async (tablename) => {
        try {
            const res = await services.getLayouts(tablename);
            if(res.message === "getLayouts success"){
                setLayouts(res.layouts);
                return;
            }
            toast.error(res.message);
        } catch (error) {
            console.log("getLayoutsError: ", error);
        }
    }

    const createLayouts = async (tablename, layoutName, layoutJson) => {
        try {
            const res = await services.createLayouts(tablename, layoutName, layoutJson);
            if(res.message === "createLayouts success"){
                toast.success(res.message);
                getLayouts(tablename);
                return;
            }
            toast.error(res.message);
        } catch (error) {
            console.log("createLayoutsError: ", error);
        }
    }

    const updateLayouts = async (tablename, layoutName, layoutJson) => {
        try {
            const res = await services.updateLayouts(tablename, layoutName, layoutJson);
            if(res.message === "updateLayouts success"){
                toast.success(res.message);
                getLayouts(tablename);
                return;
            }
            toast.error(res.message);
        } catch (error) {
            console.log("updateLayoutsError: ", error);
        }
    }

    const deleteLayouts = async(tablename, layoutId) => {
        try {
            const res = await services.deleteLayouts(layoutId);
            if(res.message == "deleteLayouts success"){
                getLayouts(tablename);
                toast.success("Delete layout success");
            }
        } catch (error) {
            console.log("deleteLayoutsError: ", error);
        }
    }

    return {
        getLayouts, createLayouts, updateLayouts, deleteLayouts
    }
}

export default useLayouts;