'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class cadastro_contratante extends Model {
    static associate(models) {
      cadastro_contratante.hasOne(models.perfil_contratante, {
        foreignKey: 'fk_cadastro_contratante_id_contratante',
        sourceKey: 'id_contratante',
      });
    }
  }

  cadastro_contratante.init({
    id_contratante: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    nm_contratante: DataTypes.STRING,
    nr_cpf: DataTypes.STRING,
    nm_email: DataTypes.STRING,
    nm_senha: DataTypes.STRING,
    recuperarSenha: DataTypes.STRING,
    confEmail: DataTypes.STRING,
    id_situacaoConfirmar: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'cadastro_contratante',
    freezeTableName: true,
    timestamps: false,
  });

  return cadastro_contratante;
};
