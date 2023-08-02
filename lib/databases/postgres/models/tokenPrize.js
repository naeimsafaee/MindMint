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
		cardTypeId: {
			type: DataTypes.BIGINT,
		},
		amount: {
			type: DataTypes.DECIMAL,
		},
		assetId: {
			type: DataTypes.BIGINT,
		},
		status: {
			type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
			defaultValue: "ACTIVE",
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
