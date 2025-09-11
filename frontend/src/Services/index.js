import axios from "axios";

const services = {
    serverURL: "http://localhost:5000/api",

    setAuthToken: () => {
        const token = localStorage.getItem("jwtToken");
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    register: async (userData) => {
        try {
            const res = await axios.post(services.serverURL + "/register", userData);
            return res.data;
        } catch (error) {
            console.log("ServicesRegisterError: ", error);
        }
    },

    login: async (userData) => {
        try {
            const res = await axios.post(services.serverURL + "/login", userData);
            return res.data;
        } catch (error) {
            console.log("ServicesLoginError: ", error);
        }
    },

    isAuth: async (token) => {
        try {
            const res = await axios.post(services.serverURL + "/isAuth", token);
            return res.data;
        } catch (error) {
            console.log("ServicesIsAuthError: ", error);
        }
    },
    
    getSearchConfig: async () => {
        try {
            const res = await axios.get(services.serverURL + "/searchConfigData");
            return res.data;
        } catch (error) {
            console.log("ServicesGetSearchConfigError: ", error)
        }
    },

    getOptionData: async (lookup_sql) => {
        try {
            const res = await axios.post(services.serverURL + "/optionData", {lookup_sql});
            return res.data;
        } catch (error) {
            console.log("ServicesGetOptionDataError: ", error);
        }
    },

    getMenuItems: async () => {
        try {
            services.setAuthToken();
            const res = await axios.get(services.serverURL + "/menuItems");
            return res.data;
        } catch (error) {
            console.log("ServicesGetMenuItemsError: ", error)
        }
    },
    
    getDynamicData: async (tableName) => {
        try {
            services.setAuthToken();
            const res = await axios.post(services.serverURL + "/dynamicData", {tableName});
            return res.data;
        } catch (error) {
            console.log("ServicesGetDynamicDataError: ", error)
        }
    }
}

export default services