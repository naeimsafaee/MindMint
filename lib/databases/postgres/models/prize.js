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
		title: {
			type: DataTypes.STRING,
		},
		amount: {
			type: DataTypes.DECIMAL,
		},
		assetId: {
			type: DataTypes.BIGINT,
		},
		cardTypeId: {
			type: DataTypes.BIGINT,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
