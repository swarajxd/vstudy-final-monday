import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ error: "Access denied! No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token!" });
        }
        req.user = user; // Attach user data to request
        next();
    });
};

export default authenticateToken;
