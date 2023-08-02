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
		agentId: {
			type: DataTypes.BIGINT,
		},
		userId: {
			type: DataTypes.BIGINT,
		},
		auctionId: {
			type: DataTypes.BIGINT,
		},
		commission: {
			type: DataTypes.DECIMAL,
			defaultValue: 0,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
