module.exports = function (sequelize, DataTypes) {
    var Role = sequelize.define("role", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
  
    Role.associate = function(models) {
    }

    return Role;
};