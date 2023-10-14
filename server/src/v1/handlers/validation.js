const { validationResult } = require("express-validator");
const mongoose = require('mongoose')

//por cada request el valida datos tambien aca en el servidor y determina si todo esta bien por ejemplo un json mal formado aca truena
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}
//en conclusion este codigo agrega seguridad para hacer que mongodb registre los datos de manera correcta
exports.isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);