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
		prize: {
			type: DataTypes.DECIMAL,
			defaultValue: 0,
		},
		status: {
			type: DataTypes.ENUM("OPEN", "CLOSE"),
			defaultValue: "OPEN",
		},
		timer: {
			type: DataTypes.STRING,
			defaultValue: "0",
		},
		lastBeat: {
			type: DataTypes.STRING,
		},
		firstBeat: {
			type: DataTypes.STRING,
		},
		assetId: {
			type: DataTypes.BIGINT,
		},
		userId: {
			type: DataTypes.BIGINT,
		},
		assignedCardId: {
			type: DataTypes.BIGINT,
		},
		cardId: {
			type: DataTypes.BIGINT,
		},
		period: {
			type: DataTypes.INTEGER,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
