const { DataTypes } = require("sequelize");

module.exports = {
	attributes: {
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
			unique: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		cardTypeId: {
			type: DataTypes.BIGINT,
			allowNull: true,
		},
		amounts: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
		},
		type: {
			type: DataTypes.ENUM("DOPAMINE", "SEROTONIN", "ANXIETY", "DAMAGE"),
			allowNull: false,
		},
		level: {
			type: DataTypes.INTEGER,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
