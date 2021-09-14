module.exports = function (sequelize, DataTypes) {
    var CheckPoint = sequelize.define("checkpoint", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        }
    });
  
    CheckPoint.associate = function(models) {
        CheckPoint.belongsTo(models.place);
        CheckPoint.hasMany(models.task);
    }

    return CheckPoint;
};