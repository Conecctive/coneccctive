const express = require('express')
const router = express.Router()


router.get('/', (req,res)=>{
    res.render('admin/sobrenos/sobrenos', {layout: 'sobrenos.handlebars'})
})

module.exports = router