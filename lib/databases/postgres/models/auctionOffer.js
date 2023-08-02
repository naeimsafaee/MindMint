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
		auctionId: {
			type: DataTypes.BIGINT,
		},
		userId: {
			type: DataTypes.BIGINT,
		},
		amount: {
			type: DataTypes.DECIMAL
		},
		status: {
			type: DataTypes.ENUM("CANCELED", "REGISTERED", "WON", "NOTWON"),
			defaultValue: "REGISTERED",
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
