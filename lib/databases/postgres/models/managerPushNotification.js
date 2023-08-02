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
		userId: {
			type: DataTypes.BIGINT,
			allowNull: true,
		},
		type: {
			type: DataTypes.ENUM("KYC", "SIGNUP", "TICKET", "PAYMENT", "ORDER", "TRANSACTION"),
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT,
		},
		opened: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
