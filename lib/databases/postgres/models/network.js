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
			type: DataTypes.STRING(32),
		},
		type: {
			type: DataTypes.STRING(32),
		},
		isDefault: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
