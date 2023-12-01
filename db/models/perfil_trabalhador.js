const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class perfil_trabalhador extends Model {
    static associate(models) {
      // Defina a associação inversa aqui
      perfil_trabalhador.belongsTo(models.cadastro_trabalhador, {
        foreignKey: 'fk_cadastro_trabalhador_id_trabalhador',
        targetKey: 'id_trabalhador',
      });
    }
  }
  

  perfil_trabalhador.init({
    id_trabalhador: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    nr_telefone: DataTypes.STRING,
    nm_perfil: DataTypes.STRING,
    nm_email2: DataTypes.STRING,
    nm_cidade: DataTypes.STRING,
    nm_estado: DataTypes.STRING,
    sobre_mim: DataTypes.STRING,
    nm_habilidades_tecnicas: DataTypes.STRING,
    img_perfil: DataTypes.STRING,
    link_github: DataTypes.STRING,
    link_linkedin: DataTypes.STRING,
    link_instagram: DataTypes.STRING,
    fk_cadastro_trabalhador_id_trabalhador: {
      type: DataTypes.INTEGER,
      references: {
        model: 'cadastro_trabalhador',
        key: 'id_trabalhador',
      },
    },
  }, {
    sequelize,
    modelName: 'perfil_trabalhador',
    freezeTableName: true,
    timestamps: false,
  });

  return perfil_trabalhador;
};
