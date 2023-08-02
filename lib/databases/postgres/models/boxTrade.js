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
		address: {
			type: DataTypes.STRING,
		},
		boxAuctionId: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		amount: {
			type: DataTypes.DECIMAL,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
