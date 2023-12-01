const express = require('express')
const router = express.Router()
const db = require('../db/models')



router.get('/', async (req,res) => {

    await db.perfil_trabalhador.findAll({
      attributes: ['id_trabalhador', 'nm_perfil','nm_habilidades_tecnicas','nm_cidade', 'nm_estado','img_perfil']
    }).then((perfil_trabalhador) =>{
      if(perfil_trabalhador.length !== 0){
        res.render('admin/perfil-contratante/inicial.handlebars', {
          layout: 'inicialContratante.handlebars', perfil_trabalhador: perfil_trabalhador.map(id_trabalhador => id_trabalhador.toJSON())})
      }else{
        res.render('admin/perfil-contratante/inicial.handlebars', {
          layout: 'inicialContratante.handlebars', erro_msg: 'Erro nenhum usuário encontrado'})
      }
 
}).catch(() =>{
  res.render('admin/perfil-contratante/inicial.handlebars', {
    layout: 'inicialContratante.handlebars', erro_msg: 'Erro nenhum usuário encontrado'})
  })
})

router.get('/perfilTrabalhador/:id_trabalhador', async (req, res) => {
  const {id_trabalhador} = req.params;
  const trabalhador = await db.perfil_trabalhador.findOne({
    attributes: ['id_trabalhador','nm_perfil','nr_telefone','nm_email2','nm_cidade','nm_estado','nm_habilidades_tecnicas','sobre_mim','img_perfil','link_github','link_linkedin', 'link_instagram'],
    where: {
      id_trabalhador
    }
  })
    if(trabalhador){
      res.render('admin/perfil-trabalhador/visitar.handlebars', {
        layout: 'visitarTrabalhador.handlebars', trabalhador})
    }else{
      req.flash("erro","Erro: Usuário não encontrado!" )

      res.redirect('/inicialContratante')
    }
  // Se o perfil do usuário não existir, crie um novo perfil

});

module.exports = router