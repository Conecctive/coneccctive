'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class cadastro_trabalhador extends Model {
    static associate(models) {
      // Defina a associação com perfil_trabalhador aqui
      cadastro_trabalhador.hasOne(models.perfil_trabalhador, {
        foreignKey: 'fk_cadastro_trabalhador_id_trabalhador',
        sourceKey: 'id_trabalhador',
      });
    }
  }

  cadastro_trabalhador.init({
    id_trabalhador: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    nm_trabalhador: DataTypes.STRING,
    nr_cpf: DataTypes.STRING,
    nm_email: DataTypes.STRING,
    nm_senha: DataTypes.STRING,
    recuperarSenha: DataTypes.STRING,
    confEmail: DataTypes.STRING,
    id_situacaoConfirmar: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'cadastro_trabalhador',
    freezeTableName: true,
    timestamps: false,
  });

  return cadastro_trabalhador;
};
