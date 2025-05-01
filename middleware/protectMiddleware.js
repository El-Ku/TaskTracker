import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1]; 
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // decoded._id is what you put in the token when you created it
            req.user = await User.findById(decoded.id).select("-password");
            return next();
        } catch (err) {
            res.status(401).json({result: "error", message: "Token is not valid"});
        }
    }
    res.status(401).json({result: "error", message: "No token provided"});
});

export default protect; 