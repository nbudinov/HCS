module.exports = function (sequelize, DataTypes) {
    var Visit = sequelize.define("visit", {
        comment: {
            type: DataTypes.STRING,
            allowNull: true,
        }, 

    });
  
    Visit.associate = function(models) {
        Visit.belongsTo(models.place);

        Visit.belongsTo(models.checkpoint);
        Visit.belongsTo(models.task);
        Visit.belongsTo(models.user);
    }

    return Visit;
};