
const express = require('express');
const { eAdmin } = require('../helpers/eAdmin'); 
const db = require('./../db/models');
const router = express.Router();
const uparImagem = require('../helpers/updateimagem')
const passport = require('passport')
const fs = require('fs');




router.get('/', async (req, res) => {
      // Se o perfil do usuário não existir, crie um novo perfil
  

        if (req.isAuthenticated()) {
          try {
            // Faça uma consulta para buscar os dados do usuário logado e do perfil_trabalhador associado
            const usuarioPerfil = await db.cadastro_trabalhador.findOne({
              where: { id_trabalhador: req.user.id_trabalhador },
              attributes: ['nm_trabalhador', 'nm_email'], // Selecione os campos do cadastro_trabalhador que deseja
              include: [{ model: db.perfil_trabalhador, attributes: ['nm_perfil','nr_telefone', 'nm_email2', 'nm_cidade', 'nm_estado', 'nm_habilidades_tecnicas', 'sobre_mim', 'img_perfil', 'link_github', 'link_linkedin','link_instagram'] }]
            });
      
            // Verifique se o usuário foi encontrado
            if (usuarioPerfil) {
              // Verifique se o perfil_trabalhador está definido
              if (usuarioPerfil.perfil_trabalhador) {
                // Renderize a página e passe os dados do usuário e do perfil_trabalhador como variáveis para o Handlebars
                res.render('admin/perfil-trabalhador/editar_trabalhador.handlebars', {
                  layout: 'editar-trabalhador.handlebars',
                  nomeUsuario: usuarioPerfil.nm_trabalhador,
                  nomeUsuario2: usuarioPerfil.perfil_trabalhador.nm_perfil,
                  emailUsuario: usuarioPerfil.nm_email,
                  telefoneUsuario: usuarioPerfil.perfil_trabalhador.nr_telefone,
                  emailSecundario: usuarioPerfil.perfil_trabalhador.nm_email2,
                  cidadeUsuario: usuarioPerfil.perfil_trabalhador.nm_cidade,
                  estadoUsuario: usuarioPerfil.perfil_trabalhador.nm_estado,
                  nm_habilidades_tecnicas: usuarioPerfil.perfil_trabalhador.nm_habilidades_tecnicas,
                  sobre_mim: usuarioPerfil.perfil_trabalhador.sobre_mim,
                  img_perfil: usuarioPerfil.perfil_trabalhador.img_perfil,
                  link_github: usuarioPerfil.perfil_trabalhador.link_github,
                  link_linkedin: usuarioPerfil.perfil_trabalhador.link_linkedin,
                  link_instagram: usuarioPerfil.perfil_trabalhador.link_instagram
                });
              } else {
                // Caso o perfil_trabalhador não esteja definido, use os dados do cadastro_trabalhador
                res.render('admin/perfil-trabalhador/editar_trabalhador.handlebars', {
                  layout: 'editar-trabalhador.handlebars',
                  nomeUsuario: usuarioPerfil.nm_trabalhador,
                  emailUsuario: usuarioPerfil.nm_email,
                  // Preencha os outros campos com dados do cadastro_trabalhador
                });
              }
            } else {
              // Trate o caso em que o usuário não foi encontrado
              res.status(404).send('Usuário não encontrado');
            }
          } catch (error) {
            // Trate qualquer erro que possa ocorrer durante a consulta
            console.error(error);
            res.status(500).send('Erro ao buscar usuário');
          }
        } else {
          // O usuário não está autenticado, redirecione-o para a página de login
          res.redirect('/login');
        }
});



router.post('/',uparImagem.single('colocar-imagem-perfil'), async (req, res) => {
  // Obtenha os dados do formulário do corpo da solicitação
  const { nome, sobremim, areasTecnologia, telefone, estados, cidades, instagram,linkedin,github,email, } = req.body;
  const id_trabalhador = req.user.id_trabalhador;

    if(req.file){
      try {
        // Verifique se o perfil do trabalhador já existe para este usuário
        let perfil = await db.perfil_trabalhador.findOne({ where: { fk_cadastro_trabalhador_id_trabalhador: id_trabalhador } });
    
        if (!perfil) {
          // Se o perfil do trabalhador não existe, crie um novo
          perfil = await db.perfil_trabalhador.create({
            nr_telefone: telefone || '',
            nm_perfil: nome || '', // Use os valores do corpo da solicitação ou um valor vazio se não estiverem definidos
            nm_estado: estados || '',
            sobre_mim: sobremim || '',
            nm_email2: email || '',
            nm_cidade: cidades || '',
            nm_habilidades_tecnicas: areasTecnologia  || '', 
            link_github: github ,
            link_linkedin: linkedin,
            link_instagram: instagram,
            img_perfil: req.file.filename || '',
            fk_cadastro_trabalhador_id_trabalhador: req.user.id_trabalhador
            , // Salve a imagem na coluna "img_perfil" como buffer
            // ... outros campos ...
          });
        } else {
          // Atualize os campos com os novos dados
            perfil.nr_telefone = telefone || '',
            perfil.nm_perfil = nome || '', // Use os valores do corpo da solicitação ou um valor vazio se não estiverem definidos
            perfil.nm_estado = estados || '',
            perfil.sobre_mim = sobremim || '',
            perfil.nm_email2 = email || '',
            perfil.nm_cidade = cidades || '',
            perfil.nm_habilidades_tecnicas = areasTecnologia  || '', 
            perfil.link_github = github ,
            perfil.link_linkedin = linkedin,
            perfil.link_instagram = instagram,
            perfil.img_perfil = req.file.filename || '', // Atualize a imagem na coluna "img_perfil" como buffer
          await perfil.save();
        }
    
        res.redirect('/perfil-trabalhador'); // Redirecione de volta para a página do perfil
      } catch (error) {
        // Trate qualquer erro que possa ocorrer durante a consulta ou atualização
        console.error(error);
        res.status(500).send('Erro ao atualizar o perfil do trabalhador');
      }
    }else{
      res.render('admin/perfil-trabalhador/editar_trabalhador.handlebars', {
      layout: 'editar-trabalhador.handlebars',erro_msg: 'Erro: tipo de arquivo não se enquadra nos padrões de imagem JPEG e PNG!'})
    }

});



module.exports = router;
