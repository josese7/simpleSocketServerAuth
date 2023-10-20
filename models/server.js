require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
      

        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            users: '/api/users',
            uploads:'/api/uploads'
        }
        //Connect to DB
        this.connectDB();
        // Middlewares
        this.middlewares();
        //Routes
        this.routes();
    }

    async connectDB(){
        await dbConnection();
    }
    middlewares(){
        //CORS
        this.app.use(cors())
        //Parse Body
        this.app.use(express.json())
        //Public Directory
        this.app.use(express.static('public'));

        //Use temp files instead of memory for managing the upload process.
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true,
        }));
    }
    routes() {
        this.app.use( this.paths.auth, require('../routes/auth'))
        this.app.use( this.paths.categories, require('../routes/categories'))
        this.app.use(this.paths.products, require('../routes/products'))
        this.app.use(this.paths.search, require('../routes/search'))
        this.app.use(this.paths.users, require('../routes/users'))
        this.app.use(this.paths.uploads, require('../routes/uploads'))

    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Server running in port', this.port)
        })
    }

    
}

module.exports = Server;