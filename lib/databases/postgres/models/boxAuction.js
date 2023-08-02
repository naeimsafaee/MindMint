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
		boxId: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		price: {
			type: DataTypes.DECIMAL,
			defaultValue: 0,
		},
		assetId: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM("ACTIVE", "INACTIVE", "FINISHED"),
			defaultValue: "ACTIVE",
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
