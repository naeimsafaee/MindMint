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
		payerId: {
			type: DataTypes.BIGINT,
		},
		payeeId: {
			type: DataTypes.BIGINT,
		},
		auctionId: {
			type: DataTypes.BIGINT,
		},
		amount: {
			type: DataTypes.DECIMAL,
		},
		fee: {
			type: DataTypes.DECIMAL,
			defaultValue: 0,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
