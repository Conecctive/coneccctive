const express = require('express');
const router = express.Router();
const { eAdmin } = require('../helpers/eAdmin'); 
const db = require('./../db/models');
const passport = require('passport')

router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
      try {
        // Faça uma consulta para buscar os dados do usuário logado e do perfil_contratante associado
        const usuarioPerfil = await db.cadastro_contratante.findOne({
          where: { id_contratante: req.user.id_contratante },
          attributes: ['nm_contratante', 'nm_email'], // Selecione os campos do cadastro_usuario que deseja
          include: [{ model: db.perfil_contratante, attributes:
        ['nr_telefone','nm_perfil', 'nm_email2', 'nm_cidade', 'nm_estado', 'sobre_mim','img_perfil'] }]
        });
  
        // Verifique se o usuário foi encontrado
        if (usuarioPerfil) {
          // Verifique se o perfil_contratante está definido
          if (usuarioPerfil.perfil_contratante) {
            // Renderize a página e passe os dados do usuário e do perfil_contratante como variáveis para o Handlebars
            res.render('admin/perfil-contratante/perfil_contratante.handlebars', {
              layout: 'perfil_contratante.handlebars',
              nomeUsuario: usuarioPerfil.nm_contratante,
              nomeUsuario2: usuarioPerfil.perfil_contratante.nm_perfil,
              emailUsuario: usuarioPerfil.nm_email,
              telefoneUsuario: usuarioPerfil.perfil_contratante.nr_telefone,
              emailSecundario: usuarioPerfil.perfil_contratante.nm_email2,
              cidadeUsuario: usuarioPerfil.perfil_contratante.nm_cidade,
              estadoUsuario: usuarioPerfil.perfil_contratante.nm_estado,
              sobremim: usuarioPerfil.perfil_contratante.sobre_mim,
              imgPerfilUsuario: usuarioPerfil.perfil_contratante.img_perfil
            });
          } else {
            // Caso o perfil_contratante não esteja definido, use os dados do cadastro_contratante
            res.render('admin/perfil-contratante/perfil_contratante2.handlebars', {
              layout: 'perfil_contratante.handlebars',
              nomeUsuario: usuarioPerfil.nm_contratante,
              emailUsuario: usuarioPerfil.nm_email,
              // Preencha os outros campos com dados do cadastro_contratante
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
  
module.exports = router;