

const express = require('express');
const { eAdmin } = require('../helpers/eAdmin'); 
const db = require('./../db/models');
const router = express.Router();
const uparImagem = require('../helpers/updateimagem')
const passport = require('passport')
const fs = require('fs');

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
          res.render('admin/perfil-contratante/editar_contratante.handlebars', {
            layout: 'editar-contratante.handlebars',
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
          res.render('admin/perfil-contratante/editar_contratante.handlebars', {
            layout: 'editar-contratante.handlebars',
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



router.post('/',uparImagem.single('colocar-imagem-perfil'), async (req, res) => {
  console.log(req.file)
  
  
  const { sobremim, telefone, estados,cidades,email, nome } = req.body; // Obtenha os dados do formulário do corpo da solicitação
  const id_contratante = req.user.id_contratante; // Obtenha o ID do usuário da sessão (usando req.user)
 
  if(req.file){
  try {
    // Verifique se o perfil do trabalhador já existe para este usuário
    let perfil = await db.perfil_contratante.findOne({ where: { fk_cadastro_contratante_id_contratante: id_contratante } });

    if (!perfil) {
      // Se o perfil do trabalhador não existe, crie um novo
      perfil = await db.perfil_contratante.create({
        nm_perfil : nome || '',
        nr_telefone: telefone || '', // Use os valores do corpo da solicitação ou um valor vazio se não estiverem definidos
        nm_estado: estados || '',
        sobre_mim: sobremim || '',
        nm_email2: email || '',
        nm_cidade: cidades || '', 
        img_perfil: req.file.filename || '',
        fk_cadastro_contratante_id_contratante: req.user.id_contratante
      });
    } else {
      // Atualize os campos com os novos dados
      perfil.nm_perfil = nome || '',
      perfil.nr_telefone = telefone || '';
      perfil.nm_estado = estados || '';
      perfil.sobre_mim = sobremim || '';
      perfil.nm_email2= email || ''
      perfil.nm_cidade= cidades || ''
      perfil.img_perfil = req.file.filename || ''
      await perfil.save();
    }

    res.redirect('/perfil-contratante'); // Redirecione de volta para a página do perfil
  } catch (error) {
    // Trate qualquer erro que possa ocorrer durante a consulta ou atualização
    console.error(error);
    res.status(500).send('Erro ao atualizar o perfil do contratante');
  }
}else{
  res.render('admin/perfil-contratante/editar_contratante.handlebars', {
    layout: 'editar-contratante.handlebars',erro_msg: 'Erro: tipo de arquivo não se enquadra nos padrões de imagem JPEG e PNG!'})
}
});



module.exports = router;
