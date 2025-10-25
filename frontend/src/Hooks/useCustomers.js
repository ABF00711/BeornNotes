const { useContext } = require("react");
const { MyContext } = require("../Context");
const { default: services } = require("../Services");

function useCustomers () {
    const {customers, setCustomers} = useContext(MyContext);

    const getCustomers = async() => {
        try {
            const res = await services.getDynamicData("Customers");
            if(res.message == "getDynamicData success"){
                setCustomers(res.dynamicData);
                return;
            }
        } catch (error) {
            console.log("getCustomersError: ", error);
        }
    }

    return (
        {getCustomers, customers, setCustomers}
    );
}

export default useCustomers;