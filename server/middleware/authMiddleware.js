// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async(req, res, next) => {
    let token;
    console.log('--- "protect" middleware initiated ---');

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {

            token = req.headers.authorization.split(" ")[1];


            const decoded = jwt.verify(token, process.env.JWT_SECRET);


            req.user = await User.findById(decoded.id).select("-password");

            console.log("Token verified, user found:", req.user.name);

            next();
        } catch (error) {
            console.error("--- TOKEN VERIFICATION FAILED ---", error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        console.log("No token found in headers.");
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

export { protect };