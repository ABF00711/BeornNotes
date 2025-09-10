const jwt = require("jsonwebtoken");
const configs = require("../Config");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if(!token){
            res.json({message: "No token profided, authorization denied."});
            return;
        }
        const decoded = jwt.verify(token, configs.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.json({message: "Token is not valid."});
    }
}

module.exports = authMiddleware;