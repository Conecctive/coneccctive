module.exports = {
eAdmin:function(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash('error', 'Erro: necessário fazer o login para acessar a página!')
        res.redirect('/login')
        }
    }
}