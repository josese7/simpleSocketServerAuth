const { response } = require("express");
const Product = require("../models/product");
const Category = require("../models/category");

const getProducts = async (req = request, res = response) => {

    //const {q, nombre = 'No name', apikey, page =1, limit} = req.query;
    const { limit = 10, from = 0 } = req.query;
    const query = { state: true }
    /* const users = await User.find(query)
    .skip(Number(from))
    .limit(Number(limit))

    const total = users.length */
    const [total, products] = await Promise.all([
        Product.count(query),
        Product.find(query)
            .skip(Number(from))
            .limit(Number(limit))
            .populate("user", 'name')
            .populate("category", 'name')


    ])
    res.json({
        total,
        products
    });
}

const getProduct = async (req = request, res = response) => {
    const id = req.params.id


    const product = await Product.findById(id)
        .populate("user", 'name')
        .populate("category", 'name');

    res.json({

        product

    });
}
const createProducts = async (req, res = response) => {

    const {state, user, ...body} = req.body
    const name = body.name.toUpperCase();
    const categoryId = req.body.category;

    const productBD = await Product.findOne({ name });

    if (productBD) {
        return res.status(400).json({
            msg: `EL producto ${productBD.name}, ya existe`
        })
    }

    const data = {
        ...body,
        name,
        user: req.userData._id,
        category: categoryId,

    }
    const product = new Product(data);

    await product.save();
    res.status(201).json(product)
}
const putProducts = async (req = request, res = response) => {
    const id = req.params.id
    const { user, state, ...data } = req.body;

    if (data.name) {
        
        data.name = data.name.toUpperCase();
    }
    //console.log("Nuevo nombre categoria", data)
    data.user = req.userData._id;

    if(data.category){
        const category = await Category.findById(data.category);
        
        if (!category){
            throw new Error(`La categoria ${id} no existe`)
        }
    }

    const newProduct = await Product.findByIdAndUpdate(id,  data, { new: true }).populate();

    res.json({

        newProduct

    });
}
const deleteProducts = async (req, res = response) => {
    const { id } = req.params;

    //delete fisically
    //const usuario = await User.findByIdAndDelete(id)
    const productDeleted = await Product.findByIdAndUpdate(id, { state: false }, { new: true })
    console.log(req.userData, 'El usuario logueado')
    res.json({
        productDeleted,
        userLoged: req.userData

    });
}

module.exports = {
    getProducts,
    createProducts,
    getProduct,
    putProducts,
    deleteProducts
}