const express = require('express')
const router = express.Router()
const session = require('express-session');
const bcrypt = require('bcryptjs')
const yup = require('yup')
const db = require('./../db/models')
const nodemailer = require('nodemailer')
const { cpf } = require('cpf-cnpj-validator');


router.get('/', (req,res)=>{
    res.render('admin/login/opcao', {layout: 'opcao'})
})


router.post('/', (req, res) => {
    const opcaoEscolhida = req.body.opcao; // Nome do campo dos botões de opção no formulário
    req.session.opcao = opcaoEscolhida; // Armazene a escolha na sessão
    res.redirect('/cadastro'); // Redirecione para a página de cadastro
});

module.exports = router