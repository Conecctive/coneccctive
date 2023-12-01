const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const yup = require('yup')
const db = require('../db/models')
const passport = require('passport')
const nodemailer = require('nodemailer')
const { cpf } = require('cpf-cnpj-validator');


//rota da página inicial
router.get('/',(req,res)=>{
    res.render('admin/login/login', {layout: 'login'})
})

//rota para receber os dados do formulário de login e validar login
router.post('/',(req,res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/login/opcao',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next)
})

//nova rota de cadastro
router.get('/cadastro',(req,res)=>{
    res.render('admin/login/cadastro', {layout: 'cadastro'})
})

router.get('/opcao', (req,res)=>{
    res.render('admin/login/opcao', {layout: 'opcao'})
})


router.post('/opcao',(req,res) =>{
    res.redirect('/tala-inicial')
})

router.get('/tela-inicial',(req,res)=>{
    res.render('admin/login/tela-inicial', {layout: 'tela-inicial'})
})
//utilizando o metodo post
router.post('/cadastro', async(req,res)=>{
    //res.send(req.body)
    //criptografar a senha
    let data = req.body
     //verificar o usuario email ja existente
     const emailVerificacao = await db.cadastro_usuario.findOne({
        where: {
            nm_email: data.email
        }
    })
    const ValidacaoCpf = data.cpf

      
    const verificacaoCpf =await db.cadastro_usuario.findOne({
        where:{
        nr_cpf: data.cpf
        }
    })

    if(emailVerificacao){
        return res.render('admin/login/cadastro',
        {layout: 'cadastro.handlebars', data: req.body , erro_msg: "Erro: email ja cadastrado"})
    } else if(!cpf.isValid(ValidacaoCpf )){
        return res.render('admin/login/cadastro',
        {layout: 'cadastro.handlebars', data: req.body , erro_msg: "Erro: Por favor digite um cpf valido!"})
    }else{
    if(verificacaoCpf){
        return res.render('admin/login/cadastro',
        {layout: 'cadastro.handlebars', data: req.body , erro_msg: "erro: CPF ja cadastrado!"}) 
    }else{

    
    const schema = yup.object().shape({
        senha: yup.string('erro: necessario preencher o campo senha').
             required('erro: necessario preencher o campo senha').
             min(6,'erro a senha deve ter no minimo 6 caracteres'),
        email: yup.string('erro: necessario preencher o campo e-mail')
            .required('erro: necessario preencher o campo e-mail').
             email('erro: necessario preencher o campo e-mail'),
        nome: yup.string('erro: necessario preencher o campo nome').
            required('erro: necessario preencher o campo nome'),
    })

    try{
        await schema.validate(data)   
    }catch(erro){
        return res.render('admin/login/cadastro',
         {layout: 'cadastro.handlebars', data: req.body, erro_msg: "erro: Não foi possivel cadastrar o usuário"})
    }
   //CRIPTOGRAFANDO A SENHA
    
    data.nm_usuario = req.body.nome
    data.nr_cpf = req.body.cpf
    data.nm_email = req.body.email
    
    data.nm_senha = await bcrypt.hash(data.senha, 8)
    // GERAR CHAVE PARA CONFIRMAR E-MAIL
    data.confEmail = (await bcrypt.hash(data.senha, 8)).replace(/\./g,"").replace(/\//g,"")
    //utlizando esse comando ja vai estar cadastrando 
    db.cadastro_usuario.create(data).then(()=>{
        //verficar o email
        let transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            secure: true,
            port: process.env.EMAIL_PORT,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          })
          let mensagem = {
            from: process.env.EMAIL_USER, //remetente
            to: data.email, //email do destinatário
            subject: "Confirma sua conta", // Título do e-mail
            text: "Prezado(a) " + data.nome + "\n\nAgradecemos a sua solicitação de cadastro em nosso site!\n\nPara que possamos liberar o seu cadastro em nosso sistema, solicitamos a confirmação do e-mail clicanco no link abaixo: " + process.env.URL_ADM + "/login/conf-email/"+ data.confEmail +" \n\nEsta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + " .<br>Você está recebendo porque está cadastrado no banco de dados da empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado pela empresa " + process.env.NAME_EMP + " tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.\n\n", // Conteúdo do e-mail somente texto
            html: "Prezado(a) " + data.nome + "<br><br>Agradecemos a sua solicitação de cadastro em nosso site!<br><br>Para que possamos liberar o seu cadastro em nosso sistema, solicitamos a confirmação do e-mail clicanco no link abaixo: <a href='" + process.env.URL_ADM +  "/login/conf-email/"+ data.confEmail +"'>" + process.env.URL_ADM + "/login/conf-email/"+ data.confEmail + "</a> <br><br>Esta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + ".<br>Você está recebendo porque está cadastrado no banco de dados da empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado pela empresa " + process.env.NAME_EMP + " tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.<br><br>", // Conteúdo do e-mail com HTML
          } 
          
          transport.sendMail(mensagem, (erro)=>{
            if(erro){
                console.log(erro)
                //mensagem de sucesso mais e-mail não enviado
                req.flash('erro', 
                'Usuário cadastrado com sucesso, porém, e-mail de confimação não enviado, entre em contato com o email'
                + process.env.EMAIL_EMPRESA + '.')
                res.redirect('/login')
            }else{
                //mensagem cadastrado com sucesso e-mail enviado com sucesso
                req.flash('sucesso_msg', 'Usuário cadastrado com sucesso, confirme o e-mail em sua caixa de entrada! ')
                res.redirect('/login')
                console.log('email enviado')
            }
          })
    }).catch((erro)=>{
        console.log(erro)
        return res.render('admin/login/cadastroContratante',
         {layout: 'cadastroContratante.handlebars', data, erro_msg: "erro: Não foi possivel cadastrar o usuário"})
    })
    }}
})

 
// criar a rota para confirmar e-mail
router.get('/conf-email/:key', async (req, res) => {
    const { key } = req.params;

    // Verificar na tabela cadastro_contratante
    const usuario = await db.cadastro_usuario.findOne({
        attributes: ['id_usuario'],
        where: {
            confEmail: key
        }
    })

    // Verificar na tabela cadastro_trabalhador
    

      if (usuario) {
        // Editar o registro na tabela cadastro_contratante
        await db.cadastro_usuario.update({
            confEmail: null,
            id_situacaoConfirmar: 1
        }, {
            where: {
                id_usuario: usuario.id_usuario
            }
        }).then(() => {
            req.flash('sucesso_msg', 'E-mail de contratante confirmado com sucesso!');
            res.redirect('/login');
        }).catch((erro) => {
            console.error(erro);
            req.flash('erro', 'Erro: link inválido! Solicite um novo link.');
            res.redirect('/login');
        })
     } else {
        req.flash('erro', 'Erro: link inválido! Solicite um novo link.');
        res.redirect('/login');
    }
});




//nova rota para receber os dados do formulario para confirmar o e-email
router.post('/novo_conf-email',async (req,res) => {
    let data = req.body

   const usuarios = await db.cadastro_usuario.findOne({
        attributes:['id_usuario', 'nm_usuario'],
        where:{
            nm_email: data.email
        }
    })

    if(usuarios){
        //gerar chave para a confirmação da conta 
        let confemail = (await bcrypt.hash(data.email,8)).replace(/\./g,"").replace(/\//g,"")
        //editar o resgistro no banco de dados 
        await db.cadastro_usuario.update({confemail}, {
            where: {id_usuario: usuarios.id_usuario}
        }).then(()=>{
            let transport = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                secure: true,
                port: process.env.EMAIL_PORT,
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASS
                }
              })
            let mensagem = {
                from: process.env.EMAIL_PASS, //remetente
                to: data.email, //email do destinatário
                subject: "confirmar sua conta", //titulo da msg
                text: "Prezado(a) " + usuarios.nome + "\n\nAgradecemos a sua solicitação de cadastro em nosso site!\n\nPara que possamos liberar o seu cadastro em nosso sistema, solicitamos a confirmação do e-mail clicanco no link abaixo: " + process.env.URL_ADM + "/login/conf-email/"+ confemail +" \n\nEsta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + " .<br>Você está recebendo porque está cadastrado no banco de dados da empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado pela empresa " + process.env.NAME_EMP + " tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.\n\n", // Conteúdo do e-mail somente texto
                html: "Prezado(a) " + usuarios.nome + "<br><br>Agradecemos a sua solicitação de cadastro em nosso site!<br><br>Para que possamos liberar o seu cadastro em nosso sistema, solicitamos a confirmação do e-mail clicanco no link abaixo: <a href='" + process.env.URL_ADM +  "/login/conf-email/"+ confemail +"'>" + process.env.URL_ADM + "/login/conf-email/"+ confemail + "</a> <br><br>Esta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + ".<br>Você está recebendo porque está cadastrado no banco de dados da empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado pela empresa " + process.env.NAME_EMP + " tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.<br><br>", // Conteúdo do e-mail com HTML
              }

            transport.sendMail(mensagem, (erro)=>{
                console.error(erro)
                if(erro){
                    //mensagem de sucesso mais e-mail não enviado
                    return res.render('admin/login/novo_conf-email', {layout: 'cadastro', data: req.body, erro_msg: "Erro: não foi possivel enviar o email, entre em contato com o suporte: " + process.env.EMAIL_EMPRESA})
                }else{
                    //mensagem de confirmação do link enviado com sucesso 
                    req.flash('sucesso_msg', 'e-mail enviado com sucesso')
                    res.redirect('/login')
                }
            })

        }).catch(()=>{
            return res.render('admin/login/novo_conf-email', {layout: 'cadastro', data: req.body, erro_msg: "Erro: não foi possivel enviar o link, entre em contato com o suporte: " + process.env.EMAIL_EMPRESA})
        })
    }else{
        return res.render('admin/login/novo_conf-email', {layout: 'cadastro', data: req.body, erro_msg: "Erro: nenhum usuário encontrado com esse e-mail!"})
    }
})

//pagina para recuperar a senha
router.get('/recuperar_senha', (req, res)=>{
    res.render('admin/login/recuperar_senha', {layout: 'cadastro'})
})

router.post('/recuperar_senha',async (req,res) => {
        let data = req.body
        console.log(data)
    
       const usuarios = await db.cadastro_usuario.findOne({
            attributes:['id_usuario', 'nm_usuario'],
            where:{
                nm_email: data.email
            }
        })
    
        if(usuarios){
           
            //gerar chave para a confirmação da conta 
            let recuperarSenha = (await bcrypt.hash(data.email,8)).replace(/\./g,"").replace(/\//g,"")
            //editar o resgistro no banco de dados 
            await db.cadastro_usuario.update({recuperarSenha}, {
                attributes:['id_usuario', 'nm_usuario'],
                where: {id_usuario: usuarios.id_usuario}
            }).then(()=>{
                let transport = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST,
                    secure: true,
                    port: process.env.EMAIL_PORT,
                    auth: {
                      user: process.env.EMAIL_USER,
                      pass: process.env.EMAIL_PASS
                    }
                  })
                  let mensagem = {
                    from: process.env.EMAIL_PASS, //remetente
                    to: data.email, //email do destinatário
                    subject: "recuperar senha", //titulo da msg
                    text: "Prezado(a) " + usuarios.nm_usuario + "\n\n esquceu sua senha? não tem problema\n\n clique no link a baixo para recupera-la: " + process.env.URL_ADM + "/login/update-senha/"+ recuperarSenha+" \n\nEsta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + " .<br>Você está recebendo porque está cadastrado no banco de dados da empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado pela empresa " + process.env.NAME_EMP + " tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.\n\n", // Conteúdo do e-mail somente texto
                    html: "Prezado(a) " + usuarios.nm_usuario + "<br><br>esquceu sua senha? não tem problema<br><br>clique no link a baixo para recupera-la: <a href='" + process.env.URL_ADM +  "/login/update-senha/"+ recuperarSenha +"'>" + process.env.URL_ADM + "/login/update-senha/"+ recuperarSenha + "</a> <br><br>Esta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + ".<br>Você está recebendo porque está cadastrado no banco de dados da empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado pela empresa " + process.env.NAME_EMP + " tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.<br><br>", // Conteúdo do e-mail com HTML
                  }
    
                transport.sendMail(mensagem, (erro)=>{
                    if(erro){
                        //mensagem de sucesso mais e-mail não enviado
                        return res.render('admin/login/recuperar_senha', {layout: 'cadastro', data: req.body, erro_msg: "Erro: não foi possivel enviar as instruções de recuperação, entre em contato com o suporte: " + process.env.EMAIL_EMPRESA})
                    }else{
                        //mensagem de confirmação do link enviado com sucesso 
                        req.flash('sucesso_msg', 'e-mail enviado com sucesso, com as devidas instruções')
                        res.redirect('/login')
                    }
                })
    
            }).catch((err)=>{
                return res.render('admin/login/recuperar_senha', {layout: 'cadastro', data: req.body, erro_msg: "Erro: não foi possivel enviar o link, entre em contato com o suporte: " + process.env.EMAIL_EMPRESA, err}), console.log(err)
               
            })
        }else{
            return res.render('admin/login/recuperar_senha', {layout: 'cadastro', data: req.body, erro_msg: "Erro: nenhum usuário encontrado com esse e-mail!"})
        }
    })

router.get('/update-senha/:key', async (req, res) => {
   const {key} = req.params
   
   //recuperar o registro do banco de dados 
   const usuarios = await db.cadastro_usuario.findOne({
    attributes: ['id_usuario'],
    where:{
        recuperarSenha: key
    }
   })
   // acessar o if paraencontrar o registro no banco de dados 
   if(usuarios){
      res.render('admin/login/update-senha',{layout: 'cadastro', data: {id_usuario: usuarios.id_usuario, key}})
   }else{
        return res.render('admin/login/recuperar_senha', {layout: 'cadastro', data: req.body, erro_msg: "Erro: nenhum usuário encontrado com esse e-mail!"})
   }
})

//utilizando o metodo post
router.post('/update-senha', async (req, res) => {
    let data = req.body;
    const schema = yup.object().shape({
        key: yup.string('Erro: link inválido, solicite novo link <a href="/login/recuperar_senha">clique aqui</a>!')
            .required('Erro: link inválido, solicite novo link <a href="/login/recuperar_senha">clique aqui</a>!'),
        id_usuario: yup.string('Erro: link inválido, solicite novo link <a href="/login/recuperar_senha">clique aqui</a>!')
            .required('Erro: link inválido, solicite novo link <a href="/login/recuperar_senha">clique aqui</a>!'),
        senha: yup.string('Erro: necessário preencher o campo senha')
            .required('Erro: necessário preencher o campo senha')
            .min(6, 'Erro: a senha deve ter no mínimo 6 caracteres!'),
    });

    try {
        await schema.validate(data);
    } catch (erro) {
        console.error(erro);
        return res.render('admin/login/update-senha', {
            layout: 'cadastro.handlebars',
            data: req.body,
            erro_msg: 'Erro: não foi possível alterar a senha'
        });
    }

    // Recuperar o registro do banco de dados
    const usuarios = await db.cadastro_usuario.findOne({
        attributes: ['id_usuario', 'nm_usuario'],
        where: {
            recuperarSenha: data.key
        }
    });

    // Acessa o if se encontrar o registro no banco de dados.
    if (usuarios) {
        let senha = await bcrypt.hash(data.senha, 8);

        await db.cadastro_usuario.update({ recuperarSenha: null, nm_senha: senha }, {
            where: { id_contratante: usuarios.id_contratante }
        }).then(() => {
            // Mensagem de sucesso
            req.flash('sucesso_msg', 'Senha alterada com sucesso!');
            res.redirect('/login');
        }).catch(() => {
            return res.render('admin/login/update-senha', {
                layout: 'cadastro.handlebars',
                data: req.body,
                erro_msg: 'Erro: não foi possível alterar a senha'
            });
        });
    } else {
        // Pausar o processamento e carregar view enviando os dados que o usuário havia preenchido
        return res.render('admin/login/recuperar_senha', {
            layout: 'cadastro.handlebars',
            data: req.body,
            erro_msg: 'Erro: solicite novo link <a href="/login/recuperar_senha">clique aqui</a>!'
        });
    }
});

// criando rota sair do site
router.get('/logout', (req,res) =>{
    req.logout(req.usuario, () => {
        req.flash('sucesso_msg', 'Deslogado com sucesso')
        res.redirect('/login')
    })
})
//exportando o que estiver no router
module.exports = router