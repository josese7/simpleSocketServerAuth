const { validationResult } = require("express-validator");

const validateFields =( req, res, next) => {
    const errors = validationResult(req);
    //if exists any errors, return status error
    if( !errors.isEmpty()){
        return res.status(400).json(errors);
    }

    next();
}

module.exports = {
    validateFields
}