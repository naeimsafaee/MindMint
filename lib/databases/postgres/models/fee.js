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
		userType: {
			type: DataTypes.ENUM("AGENT", "NORMAL"),
			defaultValue: "NORMAL",
			allowNull: false,
		},
		userLevel: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		depositFee: {
			type: DataTypes.DECIMAL,
			defaultValue: 0,
			allowNull: false,
		},
		withdrawFee: {
			type: DataTypes.DECIMAL,
			defaultValue: 0,
			allowNull: false,
		},
		referralReward: {
			type: DataTypes.DECIMAL,
			defaultValue: 0,
		},
		userCount: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		targetPrice: {
			type: DataTypes.DECIMAL,
			defaultValue: 0,
		},
		reward: {
			type: DataTypes.DECIMAL,
			defaultValue: 0,
		},
		assetId: {
			type: DataTypes.BIGINT,
			default: null,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
