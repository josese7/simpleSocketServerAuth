const path = require("path")
const fs = require("fs")
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

module.exports = {
    loadFile,
    updateImage
}