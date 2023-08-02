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
			allowNull: false,
		},
		referredUserId: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		type: {
			type: DataTypes.ENUM("SUBSCRIPTION", "TICKET", "REFERRAL", "CAMERA"),
		},
		typeId: {
			type: DataTypes.BIGINT,
		},
		amount: {
			type: DataTypes.DECIMAL,
		},
		feePercent: {
			type: DataTypes.DECIMAL,
		},
		assetId: {
			type: DataTypes.BIGINT,
		},
		level: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		auctionId: { type: DataTypes.BIGINT },
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
