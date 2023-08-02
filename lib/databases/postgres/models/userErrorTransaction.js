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
			allowNull: false,
		},
		currency: {
			type: DataTypes.STRING,
		},
		amount: {
			type: DataTypes.DECIMAL,
		},
		date: {
			type: DataTypes.DATE,
		},
		information: {
			type: DataTypes.JSONB,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
