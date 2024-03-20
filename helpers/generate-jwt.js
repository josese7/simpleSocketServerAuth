const jwt = require('jsonwebtoken')
const { User } = require('../models')
const generateJWT = (uid = '') =>{
        return new Promise( (resolve, reject) =>{
            
            const payload = { uid };

            jwt.sign(payload, process.env.secretOrPrivateKey, { expiresIn: '4h'},
             (err, token)=>{
                if(err){
                    console.log(err)
                    reject('No se pudo generar el token')

                }else{
                    resolve(token)
                }
             })

        })
}

const checkToken = async (token = '') =>{
    try {
        if(token.length<10){
            return null
        }

        const { uid } = jwt.verify(token, process.env.secretOrPrivateKey);
        const user = await User.findById(uid);

        if(!user){
            return null
        }

        if(user.state){
            return user
        }

    } catch (error) {
        console.log(error)
        return null
    }

}
module.exports = {
    generateJWT,
    checkToken
}