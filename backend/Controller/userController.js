const { userDA } = require("../Data_Access/index.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const configs = require("../Config/index.js");

const userController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const existingUser = await userDA.getOneData({email});
            if (existingUser) {
                return res.json({ message: "User already exists" });
            }

            const encryptedPassword = await bcrypt.hash(password, 10);
            const newUser = {name, email, hashedPassword: encryptedPassword};
            await userDA.create(newUser);

            jwt.sign(newUser, configs.JWT_SECRET, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    console.log("jwt sign failed", err);
                    res.json({ message: "jwt sign failed" });
                }
                res.json({ message: "register success", user: newUser, token });
            });
        } catch (error) {
            console.log("register failed", error);
            res.json({ message: "register failed" });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await userDA.getOneData({email});
            if (!user) {
                return res.json({ message: "User not found" });
            }
            const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
            if (!isPasswordValid) {
                return res.json({ message: "Invalid password" });
            }
            jwt.sign({ name: user.name, email: user.email, hashedPassword: user.hashedPassword }, configs.JWT_SECRET, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    console.log("jwt sign failed", err);
                    res.json({ message: "jwt sign failed" });
                }
                res.json({ message: "login success", user, token });
            });
        } catch (error) {
            console.log("login failed", error);
            res.json({ message: "login failed" });
        }
    },

    logout: async (req, res) => {
        try {
            const { token } = req.body;
            const decoded = jwt.verify(token, configs.JWT_SECRET);
            const user = await userDA.getOneData({email: decoded.email});
            if (!user) {
                return res.json({ message: "User not found" });
            }
            await userDA.delete(user._id);
            res.json({ message: "logout success" });
        } catch (error) {
            console.log("logout failed", error);
            res.json({ message: "logout failed" });
        }
    }
};

module.exports = userController;