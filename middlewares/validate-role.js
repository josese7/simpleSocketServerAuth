const { response } = require("express");


const isAdminRole = (req, res=response, next) =>{


    if(!req.userData){
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        })
    }

    const { role, name} = req.userData;

    if( role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: 'El usuario no es administrador'
        })
    }
    next();
}
const haveRole  = (...roles)=>{
    
    
    
    return (req, res =response, next) =>{
        console.log(roles);
    
        if(!req.userData){
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }
        if( !roles.includes(req.userData.rol)){
            return res.status(401).json({
                msg: `El servicion requiere uno de estos roles ${roles}`
            })
        }
            next();
       }
}
module.exports= {
    isAdminRole,
    haveRole
}