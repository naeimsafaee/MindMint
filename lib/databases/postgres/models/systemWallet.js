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
		assetId: {
			type: DataTypes.BIGINT,
		},
		amount: {
			type: DataTypes.DECIMAL,
			defaultValue: 0,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
