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
		countryName: {
			type: DataTypes.STRING,
		},
		countryCode: {
			type: DataTypes.STRING,
		},
		countryLogo: {
			type: DataTypes.JSONB,
			defaultValue: [],
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
