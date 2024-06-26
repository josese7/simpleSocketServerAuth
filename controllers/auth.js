const {response} = require('express')
const bcryptjs = require('bcryptjs');
const User = require('../models/users');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');
const login = async (req, res = response)=>{
    const {email, password} = req.body
    try {

        //Verificate if the email exits
        const user = await User.findOne({email})
        if ( !user ){
            return res.status(400).json({
                msg: 'Usuario / Password incorrectos - email'
            })
        }
        if ( !user.state){
            return res.status(400).json({
                msg:'Usuario / Password incorrectos - state false'
            })
        }
        const validatePassword = bcryptjs.compareSync( password, user.password);
        if ( !validatePassword){
            return res.status(400).json({
                msg:'Usuario / Password incorrectos - password'
            })
        }

        //Generate JWT
        const token = await generateJWT(user.id)
        res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg:'Error en el servidor'
        })
    }
}

const googleSignIn = async (req, res=response)=>{
    const {id_token} = req.body
    
try {
    const {name, picture, email} = await googleVerify(id_token);
    let user = await User.findOne({email})
    if(!user){
        //Create user
        
        const data = {
            name,
            email,
            password: name+email+'google',
            google: true,
            role: "USER_ROLE"
            
        }
        console.log("create user", data)
        user = new User(data)
        await user.save()
       

       // console.log('datos del usuario google', email, name, picture)
    
    }
 
    //If user state false
    if(!user.state){
        return res.status(401).json({
            msg: 'Usuario bloqueado'
        })
    }
    
    //Generate JWT
    console.log(user, "Usuario encontraado")
    const token = await generateJWT(user.id)
    res.json({
        msg:"Google autenticado",
        user,
        token
    }) 
} catch (error) {
    console.log(error)
    res.status(400).json({
        ok:false,
        msg:'El token no se pudo verificar'
    })
    
}



}
const refreshToken = async (req, res =response) => {
   const user =req.userData
   const token = await generateJWT(user.id)

   res.status(202).json({
    user,
    token
   })
}

module.exports = {
    login,
    googleSignIn,
    refreshToken,
}