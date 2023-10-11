const { response } = require("express");
const Category = require("../models/category");

const getCategories = async (req=request, res= response)=>{

    //const {q, nombre = 'No name', apikey, page =1, limit} = req.query;
    const {limit = 10, from = 0} =req.query;
    const query = {state:true}
    /* const users = await User.find(query)
    .skip(Number(from))
    .limit(Number(limit))

    const total = users.length */
    const [total, categories] = await Promise.all([
        Category.count(query),
        Category.find(query)
            .skip(Number(from))
            .limit(Number(limit))
            .populate("user",'name')
            

    ])
    res.json({
        total,
        categories
    });
}

const getCategory = async (req=request, res = response)=>{
    const id = req.params.id
   
    
    const category = await Category.findById(id).populate("user",'name');

    res.json({
       
        category
    
    });
}
const createCategory = async (req, res = response) => {

    const name = req.body.name.toUpperCase();

    const categoryBD = await Category.findOne({name});

    if( categoryBD ){
        return res.status(400).json({
            msg:`La categoria ${categoryBD.name}, ya existe`
        })
    }

    const data = {
        name,
        user: req.userData._id
    }
    const category = new Category(data);

    await category.save();
    res.status(201).json(category)
}
const putCategory = async (req=request, res = response)=>{
    const id = req.params.id
    const {  user, state, ...data } = req.body;

    if(!data.name){
        res.status(400).json({
            msg: 'El nombre es obligatorio para actualizar la Categoria'
        })

    }
    data.name = data.name.toUpperCase();
    //console.log("Nuevo nombre categoria", data)
    data.user = req.userData._id;
    const newCategory = await Category.findByIdAndUpdate(id, {name: data.name},{new: true}).populate();

    res.json({
       
        newCategory
    
    });
}
const deleteCategory = async (req, res= response)=>{
    const {id } = req.params;

    //delete fisically
    //const usuario = await User.findByIdAndDelete(id)
    const categoryDeleted = await Category.findByIdAndUpdate(id, {state: false }, {new:true})
    console.log(req.userData, 'El usuario logueado')
    res.json({
        categoryDeleted,
        userLoged:req.userData

    });
}

module.exports={
    getCategories,
    createCategory,
    getCategory,
    putCategory,
    deleteCategory
}