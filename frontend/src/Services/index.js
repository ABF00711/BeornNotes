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
    
    getDynamicData: async (tableView) => {
        try {
            services.setAuthToken();
            const res = await axios.post(services.serverURL + "/dynamicData/get", {tableView});
            return res.data;
        } catch (error) {
            console.log("ServicesGetDynamicDataError: ", error)
        }
    },

    createDynamicData: async (tablename, newData) => {
        try {
            services.setAuthToken();
            const res = await axios.post(services.serverURL + "/dynamicData/create", {tablename, newData});
            return res.data;
        } catch (error) {
            console.log("ServicesCreateDynamicDataError: ", error)
        }
    },

    updateDynamicData: async (tablename, newData) => {
        try {
            services.setAuthToken();
            const res = await axios.post(services.serverURL + "/dynamicData/update", {tablename, newData});
            return res.data;
        } catch (error) {
            console.log("ServicesUpdateDynamicDataError: ", error);
        }
    },

    deleteDynamicData: async (tablename, selectedRows) => {
        try {
            services.setAuthToken();
            const res = await axios.post(services.serverURL + "/dynamicData/delete", {tablename, selectedRows});
            return res.data;
        } catch (error) {
            console.log("ServicesDeleteDynamicDataError: ", error);
        }
    },

    getSearchpatterns: async (tablename) => {
        try {
            services.setAuthToken();
            const res = await axios.post(services.serverURL + "/searchpatterns/get", {tablename});
            return res.data;
        } catch (error) {
            console.log("ServicesGetSearchpatternsError: ", error);
        }
    },

    updateSearchpatterns: async (searchData, searchName, tablename) => {
        try {
            services.setAuthToken();
            const res = await axios.post(services.serverURL + "/searchpatterns/update", {searchData, searchName, tablename});
            return res.data;
        } catch (error) {
            console.log("ServicesUpdateSearchpatternsError: ", error);
        }
    },

    createSearchpatterns: async (searchData, searchName, tablename) => {
        try {
            services.setAuthToken();
            const res = await axios.post(services.serverURL + "/searchpatterns/create", {searchData, searchName, tablename});
            return res.data;
        } catch (error) {
            console.log("ServicesCreateSearchpatternsError: ", error);
        }
    },

    deleteSearchpatterns: async (id) => {
        try {
            services.setAuthToken();
            const res = await axios.post(services.serverURL + "/searchpatterns/delete", {id});
            return res.data;
        } catch (error) {
            console.log("ServicesDeleteSearchpatternsError: ", error);
        }
    },

    getLayouts: async (tablename) => {
        try {
            services.setAuthToken();
            const res = await axios.post(services.serverURL + "/layouts/get", {tablename});
            return res.data;
        } catch (error) {
            console.log("ServicesGetLayoutsError: ", error);
        }
    },

    createLayouts: async (tablename, layoutName, layoutJson) => {
        try {
            services.setAuthToken();
            const res = await axios.post(services.serverURL + "/layouts/create", {tablename, layoutName, layoutJson});
            return res.data;
        } catch (error) {
            console.log("ServicesCreateLayoutsError: ", error);
        }
    },

    updateLayouts: async (tablename, layoutName, layoutJson) => {
        try {
            services.setAuthToken();
            const res = await axios.post(services.serverURL + "/layouts/update", {tablename, layoutName, layoutJson});
            return res.data;
        } catch (error) {
            console.log("ServicesUpdateLayoutsError: ", error);
        }
    },

    deleteLayouts: async(layoutId) => {
        try {
            services.setAuthToken();
            const res = await axios.post(services.serverURL + "/layouts/delete", {layoutId});
            return res.data;
        } catch (error) {
            console.log("ServicesDeleteLayoutsError: ", error);
        }
    },

    getTabInterfaces: async () => {
        try {
            services.setAuthToken();
            const res = await axios.get(services.serverURL + "/tabInterfaces/get");
            return res.data;
        } catch (error) {
            console.log("getTabInterfacesError: ", error);
        }
    },

    createTabInterface: async (tabInterfaceName, tabInterfaceJson) => {
        try {
            services.setAuthToken();
            const res = await axios.post(services.serverURL + "/tabInterfaces/create", {tabInterfaceJson, tabInterfaceName});
            return res.data;
        } catch (error) {
            console.log("createTabInterfaceError: ", error);
        }
    },

    updateTabInterface: async (tabInterfaceName, tabInterfaceJson) => {
        try {
            services.setAuthToken();
            const res = await axios.post(services.serverURL + "/tabInterfaces/update", {tabInterfaceJson, tabInterfaceName});
            return res.data;
        } catch (error) {
            console.log("updateTabInterfaceError: ", error);
        }
    },

    deleteTabInterface: async (id) => {
        try {
            services.setAuthToken();
            const res = await axios.post(services.serverURL + "/tabInterfaces/delete", {id});
            return res.data;
        } catch (error) {
            console.log("deleteTabInterfaceError: ", error);
        }
    }
}

export default services