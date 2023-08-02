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
		key: {
			type: DataTypes.STRING(250),
		},
		value: {
			type: DataTypes.STRING(1000),
		},
		type: {
			type: DataTypes.ENUM("ANDROID", "IOS"),
			defaultValue: "ANDROID",
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
