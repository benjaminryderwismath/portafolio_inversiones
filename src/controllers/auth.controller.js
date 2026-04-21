
const authSerivice = require("../services/auth.service");
const AppError = require("../utils/AppError");

const register = async(req, res, next) => {
    try{
        const {nombre, email, password} = req.body;

        if(!nombre || !email || !password) {
            throw new AppError("nombre, email y password requeridos", 400);
        }

        const user = await authSerivice.register(nombre, email, password);

        res.status(201).json({
            message: "usuario creado",
            user: {
                id: user.id,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

const login = async(req, res, next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            throw new AppError("Email y password requeridos", 400);
        }

        const {usuario, accessToken, refreshToken} = await authSerivice.login(email, password);

        res.json({accessToken, refreshToken});
    } catch (error) {
        next (error)
    }
};

const refresh = async (req, res, next) => {
    try {
        const {refreshToken} = req.body;

        if (!refreshToken) {
            throw new AppError("Token invalido", 400);
        }

        const {accessToken} = await authSerivice.refresh(refreshToken);

        res.json({accessToken, refreshToken});
    } catch (error) {
        next (error)
    }
};

const logout = async(req, res, next) => {
    try{
        const{refreshToken} = req.body;

        if(!refreshToken) {
            throw new AppError("Token invalido", 400);
        }

        await authSerivice.logout(refreshToken);
            res.json({ message:"Sesion cerrada "});
            
    } catch (error) {
        next (error)
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout
};

