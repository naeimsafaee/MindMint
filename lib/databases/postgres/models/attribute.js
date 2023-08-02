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
		name: {
			type: DataTypes.ENUM("DOPAMINE", "SEROTONIN", "ANXIETY", "DAMAGE", "LEVEL", "HEAT"),
			allowNull: false,
		},
		type: {
			type: DataTypes.ENUM("INITIAL", "FEE", "REWARD"),
			defaultValue: "INITIAL",
		},
		amount: {
			type: DataTypes.DECIMAL,
			defaultValue: 0,
		},
		maxAllowed: {
			type: DataTypes.INTEGER,
		},
		icon: {
			type: DataTypes.JSONB,
			defaultValue: [],
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
