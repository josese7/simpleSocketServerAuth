const { Router} = require('express');

const { check, body, param } = require('express-validator');

const { validateFields, validarJWT, isAdminRole } = require('../middlewares');
const { createCategory, getCategories, getCategory, putCategory, deleteCategory } = require('../controllers/categories');
const { existCategoryById } = require('../helpers/db-validators');


const router = Router();
//Get categories - public
router.get('/', getCategories)
//Get category by id - public
router.get('/:id', [
    param('id', 'No es un id valido').isMongoId(),
    param('id').custom(existCategoryById),
    validateFields
],getCategory)
//Create category -private - with token
router.post('/', [
    validarJWT,
    body('name','El nombre es obligatorio').not().isEmpty(),
    validateFields,

], createCategory)
//Update - private - with token
router.put('/:id', [
    validarJWT,
    body('name', 'El nombre es obligatorio').not().isEmpty(),
    param('id', 'No es un id valido').isMongoId(),
    param('id').custom(existCategoryById),
    validateFields
],putCategory)
// Delete category - private - Admin
router.delete('/:id', [
    validarJWT,
    isAdminRole,
    param('id', 'No es un id valido').isMongoId(),
    validateFields,
    param('id').custom(existCategoryById),
    validateFields
],deleteCategory)





module.exports = router;