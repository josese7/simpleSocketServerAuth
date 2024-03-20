
const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/users')
const validarJWT = async ( req= request, res = response, next ) =>{

    const token = req.header('x-token');

    //console.log('Token', token)
    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }
    try {
        
        const {uid} = jwt.verify(token, process.env.secretOrPrivateKey);

        //console.log('Payload', uid)
        //Verify user exits in DB
        userLoged = null
        userLoged = await User.findById(uid);

        //
        if( !userLoged ){
            console.log('User no existe')
            return res.status(401).json({
                msg:'Token no valido - User dont exist'
            })
        }
    
        //Verify state is true
        if(!userLoged.state){
            return res.status(401).json({
                msg:'Token no valido - User state: false'
            })
        }

        req.userData =userLoged
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validarJWT
}