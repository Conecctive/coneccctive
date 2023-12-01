const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class perfil_contratante extends Model {
    static associate(models) {
      // Defina a associação inversa aqui
      perfil_contratante.belongsTo(models.cadastro_contratante, {
        foreignKey: 'fk_cadastro_contratante_id_contratante',
        targetKey: 'id_contratante',
      });
    }
  }
  

  perfil_contratante.init({
    id_contratante: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    nm_perfil:DataTypes.STRING,
    nr_telefone: DataTypes.STRING,
    nm_email2: DataTypes.STRING,
    nm_cidade: DataTypes.STRING,
    nm_estado: DataTypes.STRING,
    sobre_mim: DataTypes.STRING,
    img_perfil: DataTypes.STRING,
    fk_cadastro_contratante_id_contratante: {
      type: DataTypes.INTEGER,
      references: {
        model: 'cadastro_contratante',
        key: 'id_contratante',
      },
    },
  }, {
    sequelize,
    modelName: 'perfil_contratante',
    freezeTableName: true,
    timestamps: false,
  });

  return perfil_contratante;
};
