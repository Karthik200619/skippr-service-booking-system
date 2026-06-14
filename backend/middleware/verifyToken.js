import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            // Read the JWT token from the cookie and reject if missing.
            const token = req.cookies.token;

            if (!token) {
                return res.status(401).json({
                    message: "Unauthorized. Please login",
                });
            }

            const decodedToken = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            if (!allowedRoles.includes(decodedToken.role)) {
                return res.status(403).json({
                    message: "Forbidden",
                });
            }

            req.user = decodedToken;

            next();
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    message: "Session expired",
                });
            }

            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({
                    message: "Invalid token",
                });
            }

            next(err);
        }
    };
};