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
		userId: {
			type: DataTypes.BIGINT,
		},
		cardId: {
			type: DataTypes.BIGINT,
		},
		type: {
			type: DataTypes.ENUM("WITHDRAW", "IN_SYSTEM"),
			defaultValue: "IN_SYSTEM",
		},
		usedCount: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		status: {
			type: DataTypes.ENUM("FREE", "INGAME", "INAUCTION", "IN_BOX", "RESERVED"),
			defaultValue: "FREE",
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
