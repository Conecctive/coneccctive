
//utilizado para guardar dados privados em outro arquivo
const multer = require('multer');
const fs = require('fs');
require('dotenv').config()
const sequelize = require('sequelize')
const mysql = require('mysql2')
const express = require('express')
const session = require('express-session');
//body parser utilziado para buscar dados do html
const bodyParser = require('body-parser')
//processador de templetes utilizado para carregar paginas em html etc
const {engine} = require('express-handlebars')
// incluir o modulo para gerenciar os diretorios (caminhos)
const path = require('path')
//dependencia para manipular as mensagens
//responsavel para manipular a mensagem 
const flash = require('connect-flash')
//implementação de autenticação
const passport = require('passport')
//incluir o arquivo dentro do diretório
require('./helpers/auth')(passport)
const app = express()

app.use(
    session({
      secret: process.env.SECRETSESSION , // Substitua 'sua_chave_secreta' por uma chave secreta real
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false, // Defina como true se estiver usando HTTPS
        maxAge: 1000 * 60 * 60 * 24, // Define o tempo de vida da sessão (opcional)
      },
    })
  );
//utilizando o handlebars definindo o template
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

//local dos arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')))
//utilizando o body 
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//criar o middleware para manipular sessão

app.use(session({
    secret: process.env.SECRETSESSION,
    resave: false,
    saveUninitialized: true
}))

//iniciar a authenticação passport
app.use(passport.initialize())
app.use(passport.session())

// armazenar mensagens
app.use(flash())
//criar o middleware
app.use((req,res,next)=>{
    res.locals.sucesso_msg = req.flash('sucesso_msg')
    res.locals.erro_msg = req.flash('erro')
    res.locals.error = req.flash('error')
    next()
})

//incluir o arquivo que possui a conexão com o banco de dados 
const db = require('./db/models/index')


const login = require('./controllers/login')
const home = require('./controllers/telainicial')
const cadastro = require ('./controllers/cadastro_contratante')
const cadastroTrabalhador = require('./controllers/cadastro_trabalhador')
const opcao = require ('./controllers/opcao')
const perfil = require ('./controllers/perfil')
const novoConfemail = require ('./controllers/novo_conf-email')
const recuperarSenha = require('./controllers/recuperarsenha')
const trabalhador = require('./controllers/trabalhador')
const contratante = require('./controllers/contratante')
const sobrenos = require('./controllers/quemSomos')
const perfilTrabalhador = require('./controllers/perfil-trabalhador')
const perfilContratnte = require('./controllers/perfil-contratante')
const inicialContratante = require('./controllers/inicialContratante')
 

app.use('/inicialContratante', inicialContratante )
app.use('/perfil-trabalhador', perfilTrabalhador )
app.use('/perfil-contratante', perfilContratnte)
app.use('/editar-trabalhador', trabalhador)
app.use('/editar-contratante', contratante )
app.use('/sobrenos', sobrenos)
app.use('/inicial', home)
app.use('/login',login)
app.use('/cadastroContratante', cadastro)
app.use('/cadastroTrabalhador', cadastroTrabalhador)
app.use('/opcao', opcao)
app.use('/perfil', perfil)
app.use('/cadastro/conf-email', cadastro)
app.use('/novo_conf-email', novoConfemail)
app.use('/recuperar_senha', recuperarSenha)
app.use('/recuperar_senha/update-senha', recuperarSenha)
app.use('/login/logout',login)
app.use('/inicialContratante/perfilTrabalhador', inicialContratante)







app.listen(8080,()=>{
    console.log('servidor rodando na porta 8080')
})