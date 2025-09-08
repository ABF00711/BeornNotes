import axios from "axios";

const services = {
    serverURL: "http://localhost:5000/api",

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
    }
}

export default services