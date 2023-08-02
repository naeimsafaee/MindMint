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
			type: DataTypes.STRING,
		},
		cardTypeId: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		image: {
			type: DataTypes.JSONB,
			defaultValue: [],
		},
		status: {
			type: DataTypes.ENUM("IN_AUCTION", "SOLD"),
			defaultValue: "IN_AUCTION",
		},
		dopamineAmount: {
			type: DataTypes.DECIMAL,
			default: 0,
		},
		serotoninAmount: {
			type: DataTypes.DECIMAL,
			default: 0,
		},
		damageAmount: {
			type: DataTypes.DECIMAL,
			default: 0,
		},
		referralCount: {
			type: DataTypes.INTEGER,
			default: 0,
			defaultValue: 0,
		},
		cardId: {
			type: DataTypes.BIGINT,
			default: null,
		},
		level: {
			type: DataTypes.INTEGER,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
