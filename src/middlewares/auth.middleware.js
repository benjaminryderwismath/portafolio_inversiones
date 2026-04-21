
const jwt = require ("jsonwebtoken");
const AppError = require ("../utils/AppError");

const verifyToken = (req, res, next) => {
    const header = req.headers.authorization;

    if (! header) {
        return next (new AppError("Token requerido", 400));
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        next (new AppError ("Token invalido", 401));
    }
};

module.exports = verifyToken;