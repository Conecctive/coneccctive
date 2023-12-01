const express = require('express');
const router = express.Router();
const { eAdmin } = require('../helpers/eAdmin'); 
const db = require('./../db/models');
const passport = require('passport')

router.get('/', async (req, res) => {
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
          res.render('admin/perfil-trabalhador/perfil_trabalhador.handlebars', {
            layout: 'perfil_trabalhador.handlebars',
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
          res.render('admin/perfil-trabalhador/perfil_trabalhador2.handlebars', {
            layout: 'perfil_trabalhador.handlebars',
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

module.exports = router;
