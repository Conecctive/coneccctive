'use strict';

//criptografar a senha
const bcrypt = require('bcryptjs')

//seeders para cadastrar registro na tablea 'usuario'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    //cadastrar o registro na tabela
    return queryInterface.bulkInsert('usuario', [{
      nome: 'Doe',
      email: 'example@example.com',
      senha: await bcrypt.hash('123445', 8),
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down () {
    
  }
};
