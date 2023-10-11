const { Router} = require('express');

const { check, body, param } = require('express-validator');

const { validateFields, validarJWT, isAdminRole } = require('../middlewares');
const { createProducts, getProducts, getProduct, putProducts, deleteProducts } = require('../controllers/products');
const { existProductsById, existCategoryById, existProductById } = require('../helpers/db-validators');


const router = Router();
//Get categories - public
router.get('/', getProducts)
//Get Products by id - public
router.get('/:id', [
    param('id', 'No es un id valido').isMongoId(),
    param('id').custom(existProductById),
    validateFields
],getProduct)
//Create Products -private - with token
router.post('/', [
    validarJWT,
    body('name','El nombre es obligatorio').not().isEmpty(),
    body('category','La categoria es obligatoria').not().isEmpty(),
    body('category', 'No es un id valido').isMongoId(),
    body('category').custom(existCategoryById),
    validateFields,

], createProducts)
//Update - private - with token
router.put('/:id', [
    validarJWT,
    param('id', 'No es un id valido').isMongoId(),
    param('id').custom(existProductById),
    validateFields
],putProducts)
// Delete Products - private - Admin
router.delete('/:id', [
    validarJWT,
    isAdminRole,
    param('id', 'No es un id valido').isMongoId(),
    validateFields,
    param('id').custom(existProductById),
    validateFields
],deleteProducts)

module.exports = router;