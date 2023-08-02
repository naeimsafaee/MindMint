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
		managerId: {
			type: DataTypes.BIGINT,
		},
		action: {
			type: DataTypes.STRING(64),
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
