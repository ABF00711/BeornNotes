const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const configs = require("../Config/index.js");
const mysqlDA = require("../Data_Access/index.js");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

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

            // Check if MFA is enabled
            if (user.mfa === 1) {
                // If MFA is enabled, require verification code
                if (!newUser.mfaCode) {
                    return res.json({ 
                        message: "MFA required", 
                        mfaRequired: true,
                        user: { name: user.name, email: user.email }
                    });
                }

                // Verify MFA code
                const verified = speakeasy.totp.verify({
                    secret: user.secret,
                    encoding: 'base32',
                    token: newUser.mfaCode,
                    window: 2
                });

                if (!verified) {
                    return res.json({ message: "Invalid MFA code" });
                }
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
            jwt.sign({ name: userData.name, email: userData.email, hashedpassword: userData.hashedpassword }, configs.JWT_SECRET, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    console.log("jwt sign failed", err);
                    res.json({ message: "jwt sign failed" });
                }
                console.log("updated user : ", userData.email, ":", userData.name);
                res.json({message: "updateProfile success", userData, token});
            });
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
    },

    getQRCode: async (req, res) => {
        try {
            const {user} = req;
            const userData = await mysqlDA.getOneData("users", {name: user.name});
            
            const secret = speakeasy.generateSecret({
                name: `BeornNotes (${userData.email})`,
                issuer: "BeornNotes",
                length: 32
            });

            const url = await qrcode.toDataURL(secret.otpauth_url);
            
            // Store secret temporarily (don't enable MFA yet)
            userData.secret = secret.base32;
            await mysqlDA.update("users", userData);
            
            res.json({
                message: "getQRCode success", 
                QRCode: {
                    url, 
                    secret: secret.base32
                }
            });
        } catch (error) {
            console.log("getQRCodeError :", error);
            res.json({message: "getQRCode failed!"});
        }
    },

    enableMFA: async (req, res) => {
        try {
            const {verificationCode} = req.body;
            const {user} = req;
            
            const userData = await mysqlDA.getOneData("users", {name: user.name});
            
            if (!userData.secret) {
                return res.json({message: "No MFA secret found. Please generate QR code first."});
            }
            
            // Verify the code
            const verified = speakeasy.totp.verify({
                secret: userData.secret,
                encoding: 'base32',
                token: verificationCode,
                window: 2 // Allow 2 time steps (60 seconds) tolerance
            });
            
            if (!verified) {
                return res.json({message: "Invalid verification code"});
            }

            // Enable MFA
            userData.mfa = 1;
            await mysqlDA.update("users", userData);
            
            res.json({message: "enableMFA success"});
        } catch (error) {
            console.log("enableMFAError :", error);
            res.json({message: "enableMFA failed!"});
        }
    },

    disableMFA: async (req, res) => {
        try {
            const {user} = req;
            const userData = await mysqlDA.getOneData("users", {name: user.name});
            
            // Disable MFA and clear secret
            userData.mfa = 0;
            userData.secret = null;
            await mysqlDA.update("users", userData);
            
            res.json({message: "disableMFA success"});
        } catch (error) {
            console.log("disableMFAError :", error);
            res.json({message: "disableMFA failed!"});
        }
    }
};

module.exports = userController;