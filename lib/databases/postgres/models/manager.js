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
			type: DataTypes.STRING(32),
		},
		mobile: {
			type: DataTypes.STRING(20),
		},
		email: {
			type: DataTypes.STRING(64),
		},
		password: {
			type: DataTypes.STRING(64),
		},
		salt: {
			type: DataTypes.STRING(64),
		},
		status: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
		loginCode: {
			type: DataTypes.INTEGER,
		},
		avatar: {
			type: DataTypes.JSONB,
			defaultValue: [],
			allowNull: true,
		},
		isSuperadmin: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};

/*
  managerStatus: {
    active: 1,
    disabled: 2,
  },
  managerRule: {
    super: 1,
    admin: 2,
    support: 3,
  },
*/
