module.exports = function (sequelize, DataTypes) {
    var Place = sequelize.define("place", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        short_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // slug: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        // },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_paying: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        visible_for_online_orders: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        },
        priority: {
            type: DataTypes.INTEGER,
            defaultValue: 999
        },
        api_token: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        company_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        company_eik: {
            type: DataTypes.STRING,
            allowNull: true
        },
        company_vat_registered: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        },
        company_city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        company_address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        company_person: {
            type: DataTypes.STRING,
            allowNull: true
        },
        company_email: {
            type: DataTypes.STRING,
            isEmail: true,
            allowNull: true
        },
        monthly_fee: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0
        },
        additional_info: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lat: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lng: {
            type: DataTypes.STRING,
            allowNull: true
        },
        visible_on_map: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        }

    });

    Place.associate = function (models) {
        Place.belongsTo(models.client);
    }

    return Place;
};