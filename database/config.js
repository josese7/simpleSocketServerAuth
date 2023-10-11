const mongoose = require('mongoose')

const dbConnection = async() =>{

    try {
        mongoose.connect(process.env.MONGODB_ATLAS, {
            useCreateIndex:true,
            useUnifiedTopology:true,
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true
        })
        console.log("Base de datos online")
    } catch (error) {
        console.log(error)
        throw new Error('Error en la base de datos')
    }

}

module.exports = {
    dbConnection
}