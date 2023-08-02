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
		name: {
			type: DataTypes.STRING,
		},
		description: {
			type: DataTypes.STRING,
		},
		cardTypeId: {
			type: DataTypes.BIGINT,
		},
		image: {
			type: DataTypes.JSONB,
			defaultValue: [],
		},
		ipfsImage: {
			type: DataTypes.STRING,
		},
		status: {
			type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
			defaultValue: "ACTIVE",
		},
		tokenId: {
			type: DataTypes.INTEGER,
		},
		attributes: {
			type: DataTypes.JSONB,
		},
		importCount: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		leftAmount: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		totalAmount: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
