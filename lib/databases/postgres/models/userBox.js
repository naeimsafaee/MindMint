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
		boxId: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		isOpened: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		boxAuctionId: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
