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
            const { email, password } = req.body;
            const user = await mysqlDA.getOneData("users", {email});
            if (!user) {
                return res.json({ message: "User not found" });
            }
            const isPasswordValid = await bcrypt.compare(password, user.hashedpassword);
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
    }
};

module.exports = userController;