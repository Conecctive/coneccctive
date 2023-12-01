
                        COMO RODAR O PROJETO BAIXADO 

instalar as dependencias 
### npm isntall

Criar a base de dados no Mysql 
Alterar as credenciais do banco de dados no arquivo ".env"

Executar as migrations
### npx sequelize-cli db:migrate


Rodar o projeto usando o nodemon
### nodemon app.js


            PASSO A PASSSO DO PROJETO 
CRIAR AS MIGRATIONS

### npm install --save-dev sequelize-cli
interface da linha de comando usada para criar modelos,
configurações e arquivos de migração para banco de dados.
### npx sequelize-cli init
utilizado para criar os arquivos config models, migrations, seeders

para criar a migration use
### npx sequelize-cli migration:generate --name create-usuarios

para executar as migrations use:
### npx sequelize-cli db:migrate

CADASTRAR COM SEEDS

comando para criar a seed
### npx sequelize-cli seed:generate --name demo-user

para executar a seed use 
## npx sequelize-cli db:seed:all

modulo para cripttografar a senha instalar
necessario a dependencia bcryptjs
### npm install --save bcryptjs

                    CADASTRAR ULTILIZANDO O FORMULARIO

instalar a dependencia body parser
### npm install --save body-parser       

facilitar a conexao do envio dos dados 
### npx sequelize-cli model:generate --name usuario --attributes "nome:string,email:string,senha:string,imagem:string"


                DEPENDÊNCIA PARA TRANMITIR MENSAGEM DE ERRO OU SUCESSO

session npm
criar sessão e armazenar os dados no servidor para ser manipulado outrora
### npm install --save express-session

mensagem flash
### npm install --save connect-flash

                VALIDAR FORMULARIO COM O YUP

isntalar
### npm install --save yup
incluir a denpendencia onde for usada

             VALIDAÇÃO LOGIN

passport implementação de autenticação
### npm install --save passport
instalar a estratégia de validação local
### npm install --save passport-local

                CONFIRMAÇÃO DE E-MAIL

dependência nodemailer modulo para enviar e-mail
### npm install --save nodemailer      

servidor fake
### mailtrap


                        