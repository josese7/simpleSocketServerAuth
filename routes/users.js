const { Router} = require('express');
const { getUsers, putUsers, postUsers, deleteUsers, usersPatch } = require('../controllers/users');
const { check, body, param } = require('express-validator');

const { isRoleValidate, isEmailExits, existUserById } = require('../helpers/db-validators');
const {validarJWT, validateFields, haveRole}  = require('../middlewares')


const router = Router();
console.log('estoy en routes')
router.get('/', getUsers)

router.put('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existUserById), 
    check('role').custom((role) => isRoleValidate(role) ),
    validateFields
], putUsers)

router.post('/', [
    check('name', 'El correo no es válido').not().isEmpty(),
    check('password', 'El password debe ser de más de 6 letras').isLength({min:6}),
    check('email', 'El correo no es válido').isEmail(),
    check('email', 'El correo ya existe').custom(isEmailExits),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']), 
    check('role').custom((role) => isRoleValidate(role) ),
    validateFields
], postUsers)

router.delete('/:id',[
    validarJWT,
    //isAdminRole,
    haveRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    param('id', 'No es un ID valido').isMongoId(),
    param('id').custom(existUserById),
    validateFields
], deleteUsers)
router.patch('/', usersPatch );

module.exports = router;