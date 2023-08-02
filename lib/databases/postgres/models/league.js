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
		countryId: {
			type: DataTypes.STRING,
		},
		leagueId: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		leagueName: {
			type: DataTypes.STRING,
		},
		leagueSeason: {
			type: DataTypes.STRING,
		},
		leagueLogo: {
			type: DataTypes.STRING,
		},
		isActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
