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
			type: DataTypes.STRING(300),
		},
		code: {
			type: DataTypes.STRING(300),
		},
		flag: {
			type: DataTypes.JSONB,
			defaultValue: [],
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
