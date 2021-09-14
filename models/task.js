module.exports = function (sequelize, DataTypes) {
    var Task = sequelize.define("task", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        rotation_start_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		rotation_days_count: {                                  // PREZ kolko dni
			type: DataTypes.INTEGER,
			allowNull: true,
		},
        times_per_day_of_task_execution: {                      // kolkoPyti na den
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
    });
  
    Task.associate = function(models) {
        Task.belongsTo(models.place);
        Task.belongsTo(models.checkpoint);
        Task.hasMany(models.visit);
        Task.belongsToMany(models.user, {
            through: 'user_task',
            constraints: false
        });    
    }
    return Task;
};