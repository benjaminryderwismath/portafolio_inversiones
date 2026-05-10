const AppError = require("../utils/AppError");

const validateId = (req, res, next) => {
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
        return next(new AppError("ID inválido", 400));
    }

    req.params.id = id;
    next();
};

module.exports = validateId;
