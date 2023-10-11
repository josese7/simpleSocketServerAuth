const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const {ObjectId} = require('mongoose').Types
const User = require('../models/users');
const Category = require('../models/category');
const Product = require('../models/product')
const colectionsAllowed = [
    'users',
    'categories',
    'products',
    'productsByCategory',
    'rols'
]

const searchUsers = async (term, res = response) => {

   
        const isMongoID = isValidObjectId(term)
        if (isMongoID) {
            const user = await User.findById(term)
            
            return res.status(200).json({
                results: user ? [user] : []
            })
        }
            
            const regex =new RegExp(term, 'i')
            const users = await User.find({
                $and: [{state:true}],
                $or: [{name: regex}, { email: regex}],
            })
            return res.json({
                results: (users) ? [users]: []
            });

    

}
const searchCategories = async (term, res = response) => {

   
    const isMongoID = isValidObjectId(term)
    if (isMongoID) {
        const categories = await Category.findById(term)
        
        return res.status(200).json({
            results: categories ? [categories] : []
        })
    }
        
        const regex =new RegExp(term, 'i')
        const categories = await Category.find({
            $and: [{state:true}],
            $or: [{name: regex}, { email: regex}],
        })
        return res.json({
            results: (categories) ? [categories]: []
        });




}
const searchProducts = async (term, res = response) => {

   
    const isMongoID = isValidObjectId(term)
    if (isMongoID) {
        const products = await Product.findById(term).populate('category', 'name')
        
        return res.status(200).json({
            results: products ? [products] : []
        })
    } 
        const regex =new RegExp(term, 'i')
        const products = await Product.find({
            $and: [{state:true}],
            $or: [{name: regex}],
        }).populate('category', 'name')

        return res.json({
            results: (products) ? [products]: []
        });




}
const searchProductsByCat = async (term, res) => {
    try {
        const isMongoID = isValidObjectId(term);
        if (isMongoID) {
            let termID = new ObjectId(term);
            console.log("Term ID", termID)
            const products = await Product.find({ category: termID, state:false }).populate('category', 'name');
            
            if (products && products.length > 0) {
                return res.status(200).json({
                    results: products
                });
            } else {
                return res.status(200).json({
                    results: products,
                    msg: 'No se encontraron productos para esta categoría.'
                });
            }
        } else {
            return res.status(400).json({
                msg: 'El ID proporcionado no es válido.'
            });
        }
    } catch (error) {
        // Manejo de errores, por ejemplo, devolver un código de error 500 en caso de error interno.
        return res.status(500).json({
            msg: `Se produjo un error al procesar la solicitud: ${error}`
        });
    }
}

const search = async (req, res = response) => {

    const { colection, term } = req.params;
   

    if (!colectionsAllowed.includes(colection)) {
        res.status(400).json({
            msg: `Las coleccion disponibles para busqueda son ${colectionsAllowed}`
        })

    }
    switch (colection) {
        case colectionsAllowed[0]:
            await searchUsers(term, res)
            break;
        case colectionsAllowed[1]:
            await searchCategories(term, res)
            break;
        case colectionsAllowed[2]:
            await searchProducts(term, res)

            break;
        case colectionsAllowed[3]:
            await searchProductsByCat(term, res);

            break;

        default:
            res.status(500).json({
                msg: `Error en la busqueda`
            })
            break;
    }

}

module.exports = {
    search
}