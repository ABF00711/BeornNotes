import services from "../Services";

const useCustomTable = () => {

    const saveGridState = async (state, formName) => {
        try {
            const res = await services.createGridState(state, formName);
            if (res.message == "createGridState success") {
                console.log(res.message);
            }
        } catch (error) {
            console.log("saveGridState: ", error);
        }
    }

    const getGridState = async (formName) => {
        try {
            const res = await services.getGridState(formName);
            if (res.message == "getGridState success") {
                return res.state;
            }
            return "";
        } catch (error) {
            console.log("getGridState: ", error);
        }
    }

    return ({
        saveGridState, getGridState
    })

}

export default useCustomTable;