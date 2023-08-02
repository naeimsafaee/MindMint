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
			type: DataTypes.STRING(25),
		},
		nickName: {
			type: DataTypes.STRING(25),
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
