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
        const res = await axios.post(services.serverURL + "/login", userData);
        return res.data;
    }
}

export default services