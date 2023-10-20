const   path  = require("path");
const {v4:uuid} = require('uuid')
const uploadFile = (files, extensionsAllowed = ['png', 'jpg', 'jpeg', 'gif', 'PNG'], folder ='') => {

    return new Promise((resolve, reject) => {

        let sampleFile;
        let uploadPath;
        sampleFile = files.file;
        const nameSliced = sampleFile.name.split('.');
        const extension = nameSliced[nameSliced.length - 1];
        console.log(extension)

        //Validate extension
        if (!extensionsAllowed.includes(extension)) {
            return reject( `La extension ${extension} no es permitida.`)
            
        }
        //Generate name
        nameTemp = uuid() + '.' + extension;
        uploadPath = path.join(__dirname, '../uploads/', folder, nameTemp);

        //Save file
        sampleFile.mv(uploadPath, function (err) {
            if (err) {
                return reject(err);
            }
            resolve( nameTemp)

        });
    });
}

module.exports = {
    uploadFile
}