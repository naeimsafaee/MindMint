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
			type: DataTypes.STRING(45),
		},
		description: {
			type: DataTypes.TEXT,
		},
		headManagerId: {
			type: DataTypes.BIGINT,
		},
		// managersId: {
		// 	type: DataTypes.BIGINT,
		// },
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};