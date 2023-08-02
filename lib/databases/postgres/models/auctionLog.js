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
		address: {
			type: DataTypes.STRING,
		},
		userId: {
			type: DataTypes.BIGINT,
		},
		auctionId: {
			type: DataTypes.BIGINT,
		},
		cardId: {
			type: DataTypes.BIGINT,
		},
		assignedCardId: {
			type: DataTypes.BIGINT,
		},
		status: {
			type: DataTypes.ENUM("PENDING", "FAILED", "FINISHED"),
			defaultValue: "PENDING",
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
