const  validarJWT  = require('../middlewares/validar-jwt');
const  validateRoles = require('../middlewares/validate-role');
const  validateFields  = require('../middlewares/validator-fields');

module.exports={
    ...validarJWT,
    ...validateFields,
    ...validateRoles

}