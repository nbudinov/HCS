module.exports = function(sequelize, DataTypes) {
    var Language = sequelize.define("language", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [2, 100],
            msg:
              "Language name must be between 2 and 100 symbols."
          }
        }
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false
      },
		icon_code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1
      },
      deleted: {
          type: DataTypes.BOOLEAN,
          defaultValue: 0
      }    
    });
  
    Language.associate = function(models) {
        // Language.hasMany(models.category_translations)

    //   Category.hasMany(models.subcategory);
    //   Category.hasOne(models.category_translations)
    };
  
    return Language;
  };
  