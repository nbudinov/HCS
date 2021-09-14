module.exports = function (sequelize, DataTypes) {
    var Client = sequelize.define("client", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        owner_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            isEmail: true
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        contract_start_date: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
        },
        trial_start_date: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
        },
        trial_end_date: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
        },
        monthly_fee: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0
        },
        additional_info: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        active: {
			type: DataTypes.BOOLEAN,
			defaultValue: 1
        },
        verified: {
			type: DataTypes.BOOLEAN,
			defaultValue: 0
        },
        place_type: {
            type: DataTypes.STRING,
            defaultValue: ""
        }
  
    });
  
    Client.associate = function(models) {
        Client.hasMany(models.place);
        // Place.hasMany(models.table);
        // Client.hasMany(models.client_menu_image);

        // Place.belongsToMany(models.ordertype, {
        //     through: 'Place_Ordertype',
        //     constraints: false
        // });    

        // Place.belongsToMany(models.product, { through: "Places_Products", constraints: false });

    }

    return Client;
};