//validar o usuario e a senha com dados locais
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../db/models')
const passport = require('passport')

module.exports = function(passport){

    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'senha'
    }, async(email, senha, done)=>{
        await db.cadastro_contratante.findOne({
            attributes: ['id_contratante','nm_senha', 'id_situacaoConfirmar', 'nr_cpf'],
            where: {
                nm_email: email
            }
        }).then((user)=>{
            if(!user){
                return done(null, false,{message: 'Erro: Usuário ou senha incorreta!.'})
            }
            bcrypt.compare(senha, user.nm_senha, (erro, correto) =>{
                
                if((correto) && (user.dataValues.id_situacaoConfirmar != 1)){
                    return done(null, false,{message: "Erro: nessário confirmar o e-mail, solicite novo link <a href='/novo_conf-email'>clique aqui</a>! "})
                }else if(correto){
                    return done(null, user)
                }else{
                    return done(null, false,{message: 'Erro: Usuário ou senha incorreta!.'})
                }
            })
        })

        passport.serializeUser((user, done) => {
            done(null, user.id_contratante);
        });

        passport.deserializeUser(async (id_contratante, done) => {
            await db.cadastro_contratante.findByPk(id_contratante,{attributes: ['id_contratante', 'nm_contratante', 'nm_email']})
            .then((usuario) => {
                done(null, usuario)
            })
            .catch((err) => {
                console.error("Erro ao desserializar o usuário:", err);
                done(err);
            });
        })
    }))
}
