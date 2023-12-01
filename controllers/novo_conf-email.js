const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const db = require('./../db/models')
const nodemailer = require('nodemailer')

router.get('/', (req,res)=>{
    res.render('admin/login/novo_conf-email', {layout: 'novoconfEmail.handlebars'})
})
router.post('/',async (req,res) => {
    let data = req.body

   const usuarios = await db.cadastro_contratante.findOne({
        attributes:['id_contratante', 'nm_contratante'],
        where:{
            nm_email: data.email
        }
    })

    if(usuarios){
        //gerar chave para a confirmação da conta 
        let confemail = (await bcrypt.hash(data.email,8)).replace(/\./g,"").replace(/\//g,"")
        //editar o resgistro no banco de dados 
        await db.cadastro_contratante.update({confemail}, {
            where: {id_contratante: usuarios.id_contratante}
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
                subject: "Confirmar sua conta", //titulo da msg
                text: "Prezado(a) " + usuarios.nm_contratante + "\n\nAgradecemos a sua solicitação de cadastro em nosso site!\n\nPara que possamos liberar o seu cadastro em nosso sistema, solicitamos a confirmação do e-mail clicanco no link abaixo: " + process.env.URL_ADM + "/cadastro/conf-email/"+ confemail +" \n\nEsta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + " .<br>Você está recebendo porque está cadastrado no banco de dados da empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado pela empresa " + process.env.NAME_EMP + " tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.\n\n", // Conteúdo do e-mail somente texto
                html: "Prezado(a) " + usuarios.nm_contratante + "<br><br>Agradecemos a sua solicitação de cadastro em nosso site!<br><br>Para que possamos liberar o seu cadastro em nosso sistema, solicitamos a confirmação do e-mail clicanco no link abaixo: <a href='" + process.env.URL_ADM +  "/cadastro/conf-email/"+ confemail +"'>" + process.env.URL_ADM + "/cadastro/conf-email/"+ confemail + "</a> <br><br>Esta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + ".<br>Você está recebendo porque está cadastrado no banco de dados da empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado pela empresa " + process.env.NAME_EMP + " tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.<br><br>", // Conteúdo do e-mail com HTML
              }

            transport.sendMail(mensagem, (erro)=>{
                console.error(erro)
                if(erro){
                    //mensagem de sucesso mais e-mail não enviado
                    return res.render('admin/login/novo_conf-email', {layout: 'novoconfEmail.handlebars', data: req.body, erro_msg: "Erro: não foi possivel enviar o email, entre em contato com o suporte: " + process.env.EMAIL_EMPRESA})
                }else{
                    //mensagem de confirmação do link enviado com sucesso 
                    req.flash('sucesso_msg', 'E-mail enviado com sucesso')
                    res.redirect('/login')
                }
            })

        }).catch(()=>{
            return res.render('admin/login/novo_conf-email', {layout: 'novoconfEmail.handlebars', data: req.body, erro_msg: "Erro: não foi possivel enviar o link, entre em contato com o suporte: " + process.env.EMAIL_EMPRESA})
        })
    }else{
        return res.render('admin/login/novo_conf-email', {layout: 'novoconfEmail.handlebars', data: req.body, erro_msg: "Erro: nenhum usuário encontrado com esse e-mail!"})
    }
})

module.exports = router