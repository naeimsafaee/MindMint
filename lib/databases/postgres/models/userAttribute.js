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
		attributeId: {
			type: DataTypes.BIGINT,
		},
		assetId: {
			type: DataTypes.BIGINT,
		},
		boxTradeId: {
			type: DataTypes.BIGINT,
		},
		amount: {
			type: DataTypes.DECIMAL,
			defaultValue: 0,
		},
		type: {
			type: DataTypes.ENUM("INITIAL", "FEE", "REWARD", "BOX"),
			defaultValue: "INITIAL",
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
