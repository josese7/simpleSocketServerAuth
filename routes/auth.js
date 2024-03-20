const { Router} = require('express');

const { check, body } = require('express-validator');

const { validateFields, validarJWT } = require('../middlewares');
const { isRoleValidate, isEmailExits } = require('../helpers/db-validators');
const { login, googleSignIn, refreshToken } = require('../controllers/auth');


const router = Router();




router.post('/login', [
    body('email', 'El correo no es válido').isEmail(),
    body('password', 'El password debe ser de más de 6 letras').not().isEmpty(),
    validateFields
], login)


router.post('/google', [
    body('idToken', 'Token de Google invalido').isEmpty(),

    validateFields
], googleSignIn)

router.get('/',  [
    validarJWT
],  refreshToken)


module.exports = router;