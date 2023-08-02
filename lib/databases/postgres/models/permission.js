const { DataTypes, DATE } = require("sequelize");

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
			type: DataTypes.STRING(500),
		},
		nickName: {
			type: DataTypes.STRING(500),
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
