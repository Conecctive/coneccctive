//gerencia requisições, rotas e URLs, entre outras funcionalidades
const express = require('express')
// utlizado para manipular as rotas da aplicação
const router = express.Router()
//requeriando o arquivo eAdmin para deixar a página dasbord restrita
const {eAdmin} = require('./../helpers/eAdmin')
//rota da página inicial
router.get('/',eAdmin,(req,res)=>{
    res.render('admin/dasboard/dasboard', {layout: 'main'} )
})

//exportando o que estiver no router
module.exports = router