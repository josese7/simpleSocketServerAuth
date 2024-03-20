const path = require("path")
const fs = require("fs")
const cloudinary = require('cloudinary').v2
const { request, response } = require("express");
const { uploadFile } = require("../helpers/upload-file");
const {User, Product} =require('../models')
const loadFile = async (req = request, res = response) => {

    try {

        const name = await uploadFile(req.files, undefined, 'test');
        res.json({
            name
        })
    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }


    // console.log('req.files >>>', req.files); // eslint-disable-line

}
 
const updateImage = async (req = request, res = response) => {

    const { id, colection } = req.params

    let model;
  
    switch(colection) {

        case 'users':
            model = await User.findById(id)
            if(!model ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }

            break;
        case 'products':
            model = await Product.findById(id)
            if(!model ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }

            break;
        default:
            return res.status(500).json({msg:'No implementado'}) 
    }
        //Clear preview images

        if (model.img){
            const pathImage = path.join(__dirname, '../uploads', colection, model.img)

            if( fs.existsSync(pathImage) ){
                fs.unlinkSync(pathImage);
            }
        }

        const name = await uploadFile(req.files, undefined, colection );
        model.img = name
        await model.save();
        res.json({
            model
        })
   

    // console.log('req.files >>>', req.files); // eslint-disable-line

}
//TODO: Mejorar validacion de coleccion
const getImage = async (req = request, res = response) => {


    const { id, colection } = req.params

    let model;
  
    switch(colection) {

        case 'users':
            model = await User.findById(id)
            if(!model ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }

            break;
        case 'products':
            model = await Product.findById(id)
            if(!model ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }

            break;
        default:
            return res.status(500).json({msg:'No implementado'}) 
    }
        //Clear preview images

        console.log(model)
        if (model.img){
            const pathImage = model.img
            
            if(pathImage){
                const cloudinaryUrl = cloudinary.url(pathImage, { secure: true });
                return res.redirect(cloudinaryUrl);
            }
        }

        const pathImage = path.join(__dirname, '../assets/no-image.jpg')
        return res.sendFile(pathImage);
   

    // console.log('req.files >>>', req.files); // eslint-disable-line

}
            
    
const updateImageCloudinary = async (req = request, res = response) => {

    const { id, colection } = req.params

    let model;
  
    switch(colection) {

        case 'users':
            model = await User.findById(id)
            if(!model ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }

            break;
        case 'products':
            model = await Product.findById(id)
            if(!model ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }

            break;
        default:
            return res.status(500).json({msg:'No implementado'}) 
    }
        //Clear preview images

        if (model.img){
            const nameArr = model.img.split('/');
            const name = nameArr[nameArr.length - 1];
            const [public_id] = name.split('.')
            await cloudinary.uploader.destroy(public_id)
        }
        const {tempFilePath } = req.files.file
        console.log(req.files)
        const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

        
        model.img = secure_url
        await model.save();
        res.json({
            model
        })
   

    // console.log('req.files >>>', req.files); // eslint-disable-line

}
module.exports = {
    loadFile,
    updateImage,
    getImage,
    updateImageCloudinary
}