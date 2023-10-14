const { validationResult } = import("express-validator");
const mongoose = import("mongoose");

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    next()
}

exports.isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);