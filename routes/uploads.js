const { Router} = require('express');

const { check, body, param } = require('express-validator');

const { loadFile, updateImageCloudinary, getImage } = require('../controllers/uploads');
const { existUserById, colectionsAllowed } = require('../helpers/db-validators');
const { validateFile, validateFields } = require('../middlewares');




const router = Router();


router.post('/',validateFile, loadFile)

router.put('/:colection/:id', [
    validateFile,
    param('colection').custom( c => colectionsAllowed(c, ['users', 'products'])),
    param('id', 'No es un ID valido').isMongoId(),
    //param('id').custom(existUserById), 
    validateFields
], updateImageCloudinary)

router.get('/:colection/:id', [
    param('colection').custom( c => colectionsAllowed(c, ['users', 'products'])),
    param('id', 'No es un ID valido').isMongoId(),
    //param('id').custom(existUserById), 
    validateFields
], getImage)

module.exports = router;