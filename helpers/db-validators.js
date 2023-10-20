const Role = require('../models/role');
const User = require('../models/users');
const Category = require('../models/category');
const Product =  require('../models/product');

const isRoleValidate = async (role ) => {
    const existRole = await Role.findOne({role});
    console.log(role, "ROL")
    if(!existRole){
        throw new Error(`El rol ${role} no esta registrado en la BD`)
    }
}

const isEmailExits = async (email= '')=>{

    const existEmail = await User.findOne({ email})
    if ( existEmail) {
        
        throw new Error( `El email ya existe`)
    }
}
const existUserById = async (id) => {
    const existUser = await User.findById(id)
    if(!existUser){
        throw new Error(`El id no existe ${id}`)
    }
    console.log('validando usuario id')
}
const existCategoryById = async (id) => {
    const existCategory = await Category.findById(id)
    if(!existCategory){
        throw new Error(`El id no existe ${id}`)
    }
    console.log('validando categoria id')
}
const existProductById =  async (id) => {
    const existProduct = await Product.findById(id)
    if(!existProduct){
        throw new Error(`El id no existe ${id}`)
    }
    console.log('validando categoria id')
} 
const colectionsAllowed = (colection = '', colections = [])=>{

    const included = colections.includes(colection)
    if(!included){
        throw new Error(`La coleccion ${colection} no es permitida.  Permitidas : ${colections}`)
    }
   return true
}


module.exports = {
    isRoleValidate,
    isEmailExits,
    existUserById,
    existCategoryById,
    existProductById,
    colectionsAllowed
}