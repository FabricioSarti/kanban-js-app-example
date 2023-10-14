const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

const tokenDecode = (req) => {
    //obtiene el token de los headers que vienen de angular
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ')[1];
        try {
            //solo verifica que el token este bien 
            const tokenDecode = jsonwebtoken.verify(
                bearer,
                process.env.TOKEN_SECRET_KEY
            )

            return tokenDecode
        } catch (error) {
            return false
        }
    } else {
        return false
    }
}

//funcion para verificar el token 
exports.verifyToken = async (req, res, next) => {

    //solo invoca a la función token decode para validar y extraer la información en formato JSON del jwt con su firma
    const tokenDecoded = tokenDecode(req);
    if (tokenDecoded) {
        const user = await User.findById(tokenDecoded.id);
        if (!user) return res.status(401).json('unauthorized')

        req.user = user;
        next()
    } else {
        return res.status(401).json('unauthorized')
    }
}