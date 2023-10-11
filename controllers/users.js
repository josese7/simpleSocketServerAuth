const {response, request} = require('express')
const User = require('../models/users')
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');

const getUsers = async (req=request, res= response)=>{

    //const {q, nombre = 'No name', apikey, page =1, limit} = req.query;
    const {limit = 10, from = 0} =req.query;
    const query = {state:true}
    /* const users = await User.find(query)
    .skip(Number(from))
    .limit(Number(limit))

    const total = users.length */
    const [total, users] = await Promise.all([
        User.count(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))

    ])
    res.json({
        total,
        users
    });
}

const putUsers = async (req=request, res = response)=>{
    const id = req.params.id
    const { _id, password, google, email, ...rest} = req.body;

    if(password){
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt)

    }
    const user = await User.findByIdAndUpdate(id , rest,  {new: true});

    res.json({
       
        user
    
    });
}
const postUsers = async (req, res = response)=>{

console.log('estoy en el controller')
    

    const {name, email, password, role } = req.body;
    const user = new User({name, email, password, role});

    //encrypting pass
    const salt = bcryptjs.genSaltSync(15);
    user.password = bcryptjs.hashSync(password, salt);
    //save on BD
    await user.save();

    res.json({
        user
    });
}

const deleteUsers = async (req, res= response)=>{
    const {id } = req.params;

    //delete fisically
    //const usuario = await User.findByIdAndDelete(id)
    const user = await User.findByIdAndUpdate(id, {state: false })
    console.log(req.userData, 'El usuario logueado')
    res.json({
        user,
        userLoged:req.userData

    });
}
const usersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}
module.exports = {
    getUsers,
    putUsers,
    postUsers,
    deleteUsers,
    usersPatch,
}