const User = require("../models/user");
const CryptoJS = require("crypto-js");
const jsonwebtoken = require("jsonwebtoken");

exports.register = async (req, res) => {

    //aca obtiene la variable password del body
    const { password } = req.body;

    try {

        //aca modifica el password
        req.body.password = CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET_KEY)

        const user = await User.create(req.body);

        //genera el token JWT
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

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username }).select('password username');
        if (!user) {
            return res.status(401).json({
                errors: [
                    {
                        param: "username",
                        msg: "Usuario invalido o error en el password"
                    }
                ]
            })
        }

        const decryptedPass = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASSWORD_SECRET_KEY
        ).toString(CryptoJS.enc.Utf8)

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