import axios from "axios";

const services = {
    serverURL: "http://localhost:5000/api",

    register: async (userData) => {
        const res = await axios.post(services.serverURL + "/register", userData);
        return res.data;
    },

    login: async () => {
        const res = await axios.post(services.serverURL + "/login", userData);
        return res.data;
    }
}

export default services