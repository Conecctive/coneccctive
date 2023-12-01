const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const db = require('./../db/models')
const nodemailer = require('nodemailer')
const yup = require('yup')



router.get('/', (req, res)=>{
    res.render('admin/login/recuperar_senha', {layout: 'recuperarSenha.handlebars'})
})

router.post('/',async (req,res) => {
        let data = req.body
        console.log(data)
    
      const usuarios = await db.cadastro_contratante.findOne({
            attributes:['id_contratante', 'nm_contratante'],
            where:{
                nm_email: data.email
            } 
        })

        const trabalhador = await db.cadastro_trabalhador.findOne({
            attributes:['id_trabalhador', 'nm_trabalhador', ],
            where:{
                nm_email: data.email
            }
        })

        if(trabalhador){
             //gerar chave para a confirmação da conta 
             let recuperarSenha = (await bcrypt.hash(data.email,8)).replace(/\./g,"").replace(/\//g,"")
             //editar o resgistro no banco de dados 
             await db.cadastro_trabalhador.update({recuperarSenha}, {
                 where: {id_trabalhador: trabalhador.id_trabalhador}
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
                     from: process.env.EMAIL_USER, //remetente
                     to: data.email, //email do destinatário
                     subject: "recuperar senha", //titulo da msg
                     text: "Prezado(a) " + trabalhador.nm_trabalhador + "\n\n esqueceu sua senha? não tem problema\n\n clique no link a baixo para recupera-la: " + process.env.URL_ADM + "/update-senha/"+ recuperarSenha+" \n\nEsta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.\n\n", 
                     html: "Prezado(a) " + trabalhador.nm_trabalhador + "<br><br>Esqueceu sua senha? não tem problema<br><br>clique no link a baixo para recupera-la: <a href='" + process.env.URL_ADM +  "/recuperar_senha/update-senha/"+ recuperarSenha +"'>" + process.env.URL_ADM + "/recuperar_senha/update-senha"+ recuperarSenha + "</a> <br><br>Esta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.<br><br>", // Conteúdo do e-mail com HTML
                   }
     
                 transport.sendMail(mensagem, (erro)=>{
                     if(erro){
                         //mensagem de sucesso mais e-mail não enviado
                         return res.render('admin/login/recuperar_senha', {layout: 'recuperarSenha.handlebars', data: req.body, erro_msg: "Erro: não foi possivel enviar as instruções de recuperação, entre em contato com o suporte: " + process.env.EMAIL_EMPRESA})
                     }else{
                         //mensagem de confirmação do link enviado com sucesso 
                         req.flash('sucesso_msg', 'E-mail enviado com sucesso, com as devidas instruções')
                         res.redirect('/login')
                     }
                 })
     
             }).catch((err)=>{
                 return res.render('admin/login/recuperar_senha', {layout: 'recuperarSenha.handlebars', data: req.body, erro_msg: "Erro: não foi possivel enviar o link, entre em contato com o suporte: " + process.env.EMAIL_EMPRESA, err}), console.log(err)
                
             })
        }
    
          else if(usuarios){
           
            //gerar chave para a confirmação da conta 
            let recuperarSenha = (await bcrypt.hash(data.email,8)).replace(/\./g,"").replace(/\//g,"")
            //editar o resgistro no banco de dados 
            await db.cadastro_contratante.update({recuperarSenha}, {
                
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
                    from: process.env.EMAIL_USER, //remetente\
                    to: data.email, //email do destinatário
                    subject: "recuperar senha", //titulo da msg
                    text: "Prezado(a) " + usuarios.nm_contratante + "\n\n esqueceu sua senha? não tem problema\n\n clique no link a baixo para recupera-la: " + process.env.URL_ADM + "/update-senha/"+ recuperarSenha+" \n\nEsta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.\n\n", 
                     html: "Prezado(a) " + usuarios.nm_contratante + "<br><br>Esqueceu sua senha? não tem problema<br><br>clique no link a baixo para recupera-la: <a href='" + process.env.URL_ADM +  "/recuperar_senha/update-senha/"+ recuperarSenha +"'>" + process.env.URL_ADM + "/recuperar_senha/update-senha"+ recuperarSenha + "</a> <br><br>Esta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.<br><br>", // Conteúdo do e-mail com HTML
                  }
    
                transport.sendMail(mensagem, (erro)=>{
                    if(erro){
                        //mensagem de sucesso mais e-mail não enviado
                        return res.render('admin/login/recuperar_senha', {layout: 'recuperarSenha.handlebars', data: req.body, erro_msg: "Erro: não foi possivel enviar as instruções de recuperação, entre em contato com o suporte: " + process.env.EMAIL_EMPRESA})
                    }else{
                        //mensagem de confirmação do link enviado com sucesso 
                        req.flash('sucesso_msg', 'E-mail enviado com sucesso, com as devidas instruções')
                        res.redirect('/login')
                    }
                })
    
            }).catch((err)=>{
                return res.render('admin/login/recuperar_senha', {layout: 'recuperarSenha.handlebars', data: req.body, erro_msg: "Erro: não foi possivel enviar o link, entre em contato com o suporte: " + process.env.EMAIL_EMPRESA, err}), console.log(err)
               
            })
        }else{
            return res.render('admin/login/recuperar_senha', {layout: 'recuperarSenha.handlebars', data: req.body, erro_msg: "Erro: nenhum usuário encontrado com esse e-mail!"})
        }
    })


router.get('/update-senha/:key', async (req, res) => {
    const {key} = req.params
    const trabalhador = await db.cadastro_trabalhador.findOne({
        attributes:['id_trabalhador' ],
        where:{
            recuperarSenha: key
        }
    })

    const usuarios = await db.cadastro_contratante.findOne({
        attributes:['id_contratante'],
        where:{
            recuperarSenha: key
        }
    })
   
    // acessar o if paraencontrar o registro no banco de dados 
    if(trabalhador){
        res.render('admin/login/update-senha',{layout: 'updateSenha.handlebars', data: {id_trabalhador: trabalhador.id_trabalhador, key}})
    }else if(usuarios){
        res.render('admin/login/update-senha',{layout: 'updateSenha.handlebars', data: {id_contratante: usuarios.id_contratante, key}})
    }
   
    else{
         return res.render('admin/login/update-senha', {layout: 'updateSenha.handlebars', data: req.body, erro_msg: "Erro: nenhum usuário encontrado com esse e-mail!"})
    }
 })
 
 //utilizando o metodo post
 router.post('/update-senha', async (req, res) => {
    const { senha, senha2, key } = req.body
     let data = req.body;
     const schema = yup.object().shape({
        key: yup
            .string()
            .required('Erro: link inválido, solicite novo link <a href="/login/recuperar_senha">clique aqui</a>!'),
        id_contratante: yup.string(),
        id_trabalhador: yup.string(),
        senha: yup
            .string()
            .required('Erro: necessário preencher o campo senha')
            .min(6, 'Erro: a senha deve ter no mínimo 6 caracteres!'),
        // Aqui você pode adicionar outras validações para seus campos
    });
    
     try {
         await schema.validate(data);
     } catch (erro) {
         console.error(erro);
         return res.render('admin/login/update-senha', {
             layout: 'updateSenha.handlebars',
             data: req.body,
             erro_msg: 'Erro: não foi possível alterar a senha'
         });
     }

     if(senha !== senha2){
        return res.render('admin/login/update-senha', {
            layout: 'updateSenha.handlebars',
            data: req.body,
            erro_msg: ' As senhas não coincidem!'
        })
     }

     const trabalhador =  await db.cadastro_trabalhador.findOne({
        attributes: ['id_trabalhador', 'nm_email'],
        where: {
            recuperarSenha: key
        }
     })

     const usuarios = await db.cadastro_contratante.findOne({
        attributes:['id_contratante', 'nm_email'],
        where:{
            recuperarSenha: key
        } 
    })

     // Recuperar o registro do banco de dados
    
     if(trabalhador){
        let senha = await bcrypt.hash(data.senha, 8);
 
         await db.cadastro_trabalhador.update({ recuperarSenha: null, nm_senha: senha }, {
             where: { id_trabalhador: trabalhador.id_trabalhador }
         }).then(() => {
             // Mensagem de sucesso
             req.flash('sucesso_msg', 'Senha alterada com sucesso!');
             res.redirect('/login');
         }).catch((erro) => {
            console.log(erro)
             return res.render('admin/login/update-senha', {
                 layout: 'updateSenha.handlebars',
                 data: req.body,
                 erro_msg: 'Erro: não foi possível alterar a senha'
             });
         });
     }else if(usuarios){

        let senha = await bcrypt.hash(data.senha, 8);
 
         await db.cadastro_contratante.update({ recuperarSenha: null, nm_senha: senha }, {
             where: { id_contratante: usuarios.id_contratante}
         }).then(() => {
             // Mensagem de sucesso
             req.flash('sucesso_msg', 'Senha alterada com sucesso!');
             res.redirect('/login');
         }).catch((erro) => {
            console.log(erro)
             return res.render('admin/login/update-senha', {
                 layout: 'updateSenha.handlebars',
                 data: req.body,
                 erro_msg: 'Erro: não foi possível alterar a senha'
             });
         });
     }
     // Acessa o if se encontrar o registro no banco de dados.
     else {
         // Pausar o processamento e carregar view enviando os dados que o usuário havia preenchido
         return res.render('admin/login/recuperar_senha', {
             layout: 'recuperarSenha.handlebars',
             data: req.body,
             erro_msg: 'Erro: solicite novo link <a href="/login/recuperar_senha">clique aqui</a>!'
         });
     }
 });

 module.exports = router
