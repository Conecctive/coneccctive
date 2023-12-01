const multer = require('multer');
const path = require('path')

module.exports = (multer({
    storage: multer.diskStorage({
        destination: (req,file,cb)=>{
            cb(null, './public/img/imagemusuario')
        },
        filename: (req, file, cb) => {
       
            cb(null, Date.now().toString() + req.user.id_trabalhador + path.extname(file.originalname))
       
    }
    }),
    fileFilter: (req,file, cb) =>{
        const extensaoImg = ['image/jpeg', 'image/jpg', 'image/png'].find(formatoAceito => formatoAceito == file.mimetype)
        
        if(extensaoImg){
            return cb(null, true)
        }
        return cb(null, false)
    }
}))