const express = require('express')
const router = express.Router()
const passport = require('passport')



//rota da página inicial
router.get('/',(req,res)=>{
    res.render('admin/login/login', {layout: 'login'})
})

//rota para receber os dados do formulário de login e validar login
router.post('/', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            req.flash('error', info.message);
            return res.redirect('/login'); 
        }
        console.log('User:', user); // Verifique o que está em 'user'
        req.logIn(user, function(err) {
            if (err) { 
                return next(err); 
            }
            // Verifique a origem do usuário e redirecione para a página de perfil correta
            if ('id_contratante' in user) {
                return res.redirect('/inicialContratante');
            } else if ('id_trabalhador' in user) {
                return res.redirect('/perfil-trabalhador');
            }
        });
    })(req, res, next);
});





// criando rota sair do site
router.get('/logout', (req,res) =>{
    req.logout(req.usuario, () => {
        req.flash('sucesso_msg', 'Usuário deslogado com sucesso')
        res.redirect('/login')
    })
})
//exportando o que estiver no router
module.exports = router