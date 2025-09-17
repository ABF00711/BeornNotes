const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const configs = require("../Config/index.js");
const mysqlDA = require("../Data_Access/index.js");

const userController = {
    register: async (req, res) => {
        try {
            const {userData} = req.body;

            const existingEmail = await mysqlDA.getOneData("users", {email: userData.email});
            if (existingEmail) {
                return res.json({ message: "Email already exists" });
            }
            const existingName = await mysqlDA.getOneData("users", {name: userData.name});
            if(existingName){
                return res.json({ message: "Username already exists" });
            }

            const encryptedPassword = await bcrypt.hash(userData.password, 10);

            const newUser = {}
            newUser["hashedpassword"] = encryptedPassword;
            for (const key in userData) {
                if (key == "password") continue;
                newUser[key] = userData[key];
            }

            await mysqlDA.create("users", newUser);

            jwt.sign(newUser, configs.JWT_SECRET, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    console.log("jwt sign failed", err);
                    res.json({ message: "jwt sign failed" });
                }
                res.json({ message: "register success", user: newUser, token });
                console.log("registered: ", newUser.email, ":", newUser.name);
            });
        } catch (error) {
            console.log("register failed", error);
            res.json({ message: "register failed" });
        }
    },

    login: async (req, res) => {
        try {
            const { newUser } = req.body;
            
            let filter = {};
            if(newUser.email){
                filter = {email: newUser.email};
            }else{
                filter = {name: newUser.name};
            }

            const user = await mysqlDA.getOneData("users", filter);
            if (!user) {
                return res.json({ message: "User not found" });
            }
            const isPasswordValid = await bcrypt.compare(newUser.password, user.hashedpassword);
            if (!isPasswordValid) {
                return res.json({ message: "Invalid password" });
            }
            jwt.sign({ name: user.name, email: user.email, hashedpassword: user.hashedpassword }, configs.JWT_SECRET, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    console.log("jwt sign failed", err);
                    res.json({ message: "jwt sign failed" });
                }
                console.log("logged in: ", user.email, ":", user.name);
                res.json({ message: "login success", user, token });
            });
        } catch (error) {
            console.log("login failed", error);
            res.json({ message: "login failed" });
        }
    },

    isAuth: async (req, res) => {
        try {
            const {token} = req.body;
            const decoded = jwt.verify(token, configs.JWT_SECRET);
            const user = await mysqlDA.getOneData("users", {email: decoded.email});
            if(user && (user.hashedpassword == decoded.hashedpassword)){
                return res.json({message: "isAuth success"});
            }
            res.json({message: "isAuth failed"});
        } catch (error) {
            console.log("isAuth failed: ", error);
            res.json({message: "isAuth failded"});
        }
    },

    logout: async (req, res) => {
        try {
            const { token } = req.body;
            const decoded = jwt.verify(token, configs.JWT_SECRET);
            const user = await mysqlDA.getOneData("users", {email: decoded.email});
            if (!user) {
                return res.json({ message: "User not found" });
            }
            await mysqlDA.delete(user._id);
            res.json({ message: "logout success" });
        } catch (error) {
            console.log("logout failed", error);
            res.json({ message: "logout failed" });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const {newData, id} = req.body;

            const userData = await mysqlDA.getOneData("users", {id});
            if(!userData) throw new Error("User is not existing!");
            for (const key in newData) {
                userData[key] = newData[key] || null;
            }
            await mysqlDA.update("users", userData);
            res.json({message: "updateProfile success", userData});
        } catch (error) {
            console.log("updateProfileError: ", error);
            res.json({message: error.message});
        }
    },

    changePassword: async (req, res) => {
        try {
            const {currentPassword, newPassword} = req.body;
            const {user} = req;

            const userData = await mysqlDA.getOneData("users", {name: user.name});

            const isPasswordValid = await bcrypt.compare(currentPassword, userData.hashedpassword);
            if (!isPasswordValid) {
                return res.json({ message: "Invalid current password" });
            }

            userData.hashedpassword = await bcrypt.hash(newPassword, 10);

            await mysqlDA.update("users", userData);
            res.json({message: "changePassword success"});
        } catch (error) {
            console.log("changePasswordError: ", error);
            res.json({message: error.message});
        }
    }
};

module.exports = userController;