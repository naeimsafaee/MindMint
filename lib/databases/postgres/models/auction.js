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
			type: DataTypes.TEXT,
			allowNull: true
		},
		cardId: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		userId: {
			type: DataTypes.BIGINT,
		},
		price: {
			type: DataTypes.DECIMAL,
			defaultValue: 0,
		},
		mintType: {
			type: DataTypes.ENUM("User", "System"),
			defaultValue: "System",
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
