const  validarJWT  = require('../middlewares/validar-jwt');
const  validateRoles = require('../middlewares/validate-role');
const  validateFields  = require('../middlewares/validator-fields');
const validateFile = require('../middlewares/validator-file');
module.exports={
    ...validarJWT,
    ...validateFields,
    ...validateRoles,
    ...validateFile

}