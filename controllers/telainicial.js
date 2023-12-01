const express = require('express')
const router = express.Router()


router.get('/', (req,res)=>{
    res.render('admin/login/tela-inicial', {layout: 'tela-inicial.handlebars'})
})

module.exports = router