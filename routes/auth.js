const { Router} = require('express');

const { check, body } = require('express-validator');

const { validateFields } = require('../middlewares/validator-fields');
const { isRoleValidate, isEmailExits } = require('../helpers/db-validators');
const { login, googleSignIn } = require('../controllers/auth');


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


module.exports = router;