

const { z } = require("zod");
const AppError = require("../utils/AppError");

const validateSchema = (schema) => (req, res, next) => {

    try {
        req.body = schema.parse(req.body)
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
        const messages = error.issues.map(e => e.message);
        return next(new AppError(messages.join(", "), 400));
        }
        next(error);
    }
};

module.exports = validateSchema;