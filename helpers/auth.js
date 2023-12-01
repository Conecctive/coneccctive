const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../db/models')
const passport = require('passport')

module.exports = function(passport){

    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'senha'
    }, async(email, senha, done)=>{
        //selecione o id, a senha, confirmação de senha e o cpf
        let user = await db.cadastro_contratante.findOne({
            attributes: ['id_contratante','nm_senha', 'id_situacaoConfirmar', 'nr_cpf'],
            where: {
                nm_email: email
            }
        });
            //selecione o id, a senha, confirmação de senha e o cpf
        if(!user){
            user = await db.cadastro_trabalhador.findOne({
                attributes: ['id_trabalhador','nm_senha', 'id_situacaoConfirmar', 'nr_cpf'],
                where: {
                    nm_email: email
                }
            });
        }

        if(!user){
            return done(null, false,{message: 'Erro: Usuário ou senha incorreta!.'})
        }

        bcrypt.compare(senha, user.nm_senha, (erro, correto) =>{
            
            if((correto) && (user.dataValues.id_situacaoConfirmar != 1)){
                return done(null, false,{message: "Erro: Nessário confirmar o e-mail, solicite novo link <a href='/novo_conf-email'>clique aqui</a>! "})
            }else if(correto){
                return done(null, user)
            }else{
                return done(null, false,{message: 'Erro: Usuário ou senha incorreta!.'})
            }
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id_contratante || user.id_trabalhador);
    });

    passport.deserializeUser(async (id, done) => {
        
        let usuario = await db.cadastro_contratante.findByPk(id,{attributes: ['id_contratante', 'nm_contratante', 'nm_email']})

        if(!usuario){
            usuario = await db.cadastro_trabalhador.findByPk(id,{attributes: ['id_trabalhador', 'nm_trabalhador', 'nm_email']})
        }

        if(usuario){
            done(null, usuario)
        }else{
            console.error("Erro ao desserializar o usuário:", err);
            done(err);
        }
    })
}
