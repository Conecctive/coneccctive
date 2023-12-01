const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const session = require('express-session');
const yup = require('yup')
const db = require('./../db/models')
const nodemailer = require('nodemailer')
const { cpf } = require('cpf-cnpj-validator');

router.get('/', (req, res) => {
  res.render('admin/login/cadastroContratante', { layout: 'cadastroContratante' })
  
})
  
  router.post('/', async (req, res) => {

    
    
    // Criptografar a senha
    let data = req.body;
    // Verificar o usuário de e-mail já existente
    const emailVerificacao = await db.cadastro_contratante.findOne({
      where: {
        nm_email: data.email,
      },
    });
    const ValidacaoCpf = data.cpf;
  
    const verificacaoCpf = await db.cadastro_contratante.findOne({
      where: {
        nr_cpf: data.cpf,
      },
    });

    const senha = data.senha
    const senha2 = data.senha2  

    if(senha !== senha2){
        return res.render('admin/login/cadastroContratante', {
            layout: 'cadastroContratante',
            data: req.body,
            erro_msg: ' As senhas não coincidem!'
        })
    }

    const email = data.email
    const email2 = data.email2

    if(email !== email2){
        return res.render('admin/login/cadastroContratante', {
            layout: 'cadastroContratante',
            data: req.body,
            erro_msg: ' Os emails não coincidem!'
        })
    }


   
    if (emailVerificacao) {
      return res.render('admin/login/cadastroContratante', {
          layout: 'cadastroContratante',
          data: req.body,
          erro_msg: 'Erro: e-mail já cadastrado!'
      })
  } else if (!cpf.isValid(ValidacaoCpf)) {
      return res.render('admin/login/cadastroContratante', {
          layout: 'cadastroContratante',
          data: req.body,
          erro_msg: 'Erro: Por favor digite um CPF válido!'
      })
  } else {
      if (verificacaoCpf) {
          return res.render('admin/login/cadastroContratante', {
              layout: 'cadastroContratante',
              data: req.body,
              erro_msg: 'Erro: CPF já cadastrado!'
          })
      } else {
          const schema = yup.object().shape({
              senha: yup
                  .string('Erro: necessário preencher o campo "senha"')
                  .required('Erro: necessário preencher o campo "senha"')
                  .min(6, 'Erro: a senha deve ter no mínimo 6 caracteres'),
              email: yup
                  .string('Erro: necessário preencher o campo "e-mail"')
                  .required('Erro: necessário preencher o campo "e-mail"')
                  .email('Erro: necessário preencher o campo "e-mail"'),
              nome: yup
                  .string('Erro: necessário preencher o campo "nome"')
                  .required('Erro: necessário preencher o campo "nome"')
          })
  
          try {
            await schema.validate(data)
        } catch (erro) {
            return res.render('admin/login/cadastroContratante', {
                layout: 'cadastroContratante',
                data: req.body,
                erro_msg: 'Erro: Não foi possível cadastrar o usuário'
            })
        }
        // Criptografando a senha
  
        data.nm_contratante = req.body.nome
        data.nr_cpf = req.body.cpf
        data.nm_email = req.body.email

        data.nm_senha = await bcrypt.hash(data.senha, 8)
        // GERAR CHAVE PARA CONFIRMAR E-MAIL
        data.confEmail = (await bcrypt.hash(data.senha, 8)).replace(/\./g, "").replace(/\//g, "")
        // Utilizando esse comando já vai estar cadastrando
        db.cadastro_contratante.create(data).then(async (usuario) => {
            // Verificar o email
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
                from: process.env.EMAIL_USER, // Remetente
                to: data.email, // Email do destinatário
                subject: "Confirma sua conta", // Título do e-mail
                text: "Prezado(a) " + data.nome + "\n\nAgradecemos a sua solicitação de cadastro em nosso site!\n\nPara que possamos liberar o seu cadastro em nosso sistema, solicitamos a confirmação do e-mail clicando no link abaixo: " + process.env.URL_ADM + "/cadastroContratante/conf-email/" + data.confEmail + "pela empresa " + process.env.NAME_EMP ,
                html: "Prezado(a) " + data.nome + "<br><br>Agradecemos a sua solicitação de cadastro em nosso site!<br><br>Para que possamos liberar o seu cadastro em nosso sistema, solicitamos a confirmação do e-mail clicando no link abaixo: <a href='" + process.env.URL_ADM + "/cadastroContratante/conf-email/" + data.confEmail + "'>" + process.env.URL_ADM + "/cadastroContratante/conf-email/" + data.confEmail + "</a> <br><br>Esta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.<br><br>", // Conteúdo do e-mail com HTML
            }

          
            transport.sendMail(mensagem, (erro) => {
              if (erro) {
                  console.log(erro)
                  // Mensagem de sucesso mais e-mail não enviado
                  req.flash('erro',
                      'Usuário cadastrado com sucesso, porém o e-mail de confirmação não foi enviado. Entre em contato com a empresa'
                      + process.env.EMAIL_EMPRESA + '.')
                  res.redirect('/login')
              } else {
                  // Mensagem cadastrado com sucesso e-mail enviado com sucesso
                  req.flash('sucesso_msg', 'Usuário cadastrado com sucesso, confirme o e-mail em sua caixa de entrada! ')
                  res.redirect('/login')
                  console.log('email enviado')
              }
          })


    }).catch((erro)=>{
        console.log(erro)
        return res.render('admin/login/cadastroContratante',
         {layout: 'cadastroContratante.handlebars', data, erro_msg: "Erro: Não foi possivel cadastrar o usuário"})
    })
    }}

    
      });
    



 
// criar a rota para confirmar e-mail
router.get('/conf-email/:key', async (req, res) => {
    const { key } = req.params;

    // Verificar na tabela cadastro_contratante
    const usuario = await db.cadastro_contratante.findOne({
        attributes: ['id_contratante'],
        where: {
            confEmail: key
        }
    })

    // Verificar na tabela cadastro_trabalhador
    

    if (usuario) {
        // Editar o registro na tabela cadastro_contratante
        await db.cadastro_contratante.update({
            confEmail: null,
            id_situacaoConfirmar: 1
        }, {
            where: {
                id_contratante: usuario.id_contratante
            }
        }).then(() => {
            req.flash('sucesso_msg', 'E-mail confirmado com sucesso!');
            res.redirect('/login');
        }).catch((erro) => {
            console.error(erro);
            req.flash('erro', 'Erro: link inválido! Solicite um novo link.');
            res.redirect('/login');
        });
    } else {
        req.flash('erro', 'Erro: link inválido! Solicite um novo link.');
        res.redirect('/login');
    }
});
module.exports = router
