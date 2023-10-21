const User = require("../models/user");
const CryptoJS = require("crypto-js");
const jsonwebtoken = require("jsonwebtoken");

exports.register = async (req, res) => {

    //aca obtiene la variable password del body
    const { password } = req.body;

    try {

        //aca modifica el password para enviarlo encriptado a la bd de mongo
        req.body.password = CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET_KEY)

        const user = await User.create(req.body);

        //genera el token JWT y en sesion se coloca info del usuario en este caso user._id
        const token = jsonwebtoken.sign(
            { id: user._id },
            process.env.PASSWORD_SECRET_KEY,
            { expiresIn: '24h' }
        )

        res.status(201).json({ user, token })
    } catch (error) {
        res.status(500).json({ error })
    }
}

//estas son variables osea, exports.login se usa en auth.js userController.login aca al final solo es un metodo no es necesario
//que la ruta se llame igual a esto 
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {

        //aca se aplican validaciones para encontrar al usuario en base al nombre del usuario
        const user = await User.findOne({ username }).select('password username');
        if (!user) {

            //en la consulta findone devuelve el nombre de usuario y passsword y lo alamcena en la variable const user
            return res.status(401).json({
                errors: [
                    {
                        param: "username",
                        msg: "Usuario invalido o error en el password"
                    }
                ]
            })
        }

        //aca intenta primero desencriptar el password que viene de la BD
        const decryptedPass = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASSWORD_SECRET_KEY
        ).toString(CryptoJS.enc.Utf8)

        //valida si el password desencriptado es igual al password pero que viene de react
        if (decryptedPass !== password) {
            return res.status(401).json({
                errors: [
                    {
                        param: 'username',
                        msg: 'Usuario invalido o el password'
                    }
                ]
            })
        }

        //borra el password para que no se muestre en el front-end
        user.password = undefined

        //aca retorna el token firmandolo y todo y colocando en el token el ID para despues buscarlo en mongo
        const token = jsonwebtoken.sign(
            { id: user._id },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '24h' }
        )

        res.status(200).json({ user, token })
    } catch (error) {
        res.status(500).json(err)
    }
}