const multer = require('multer')

module.exports = (multer({
    storage: multer.diskStorage({
        destination:(req,file,cd) =>{
            cb (null, './imgagen/usuario')
        },
        filename: (req,file,cb)=>{
            cb(null, Date.now().toString + "_" + file.originalname)
        }
    }),
    fileFilter: (req, file, cb)=> {
        const extensaoimg = ['image/png' , 'image/jpg', 'image/jpeg'].find(formatoaceito => formatoAceito == file.mimetype)
        if(extensaoimg){
            return cb(null, true)
        }

        return cb(null, false)
    }
}))