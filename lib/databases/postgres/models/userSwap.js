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
		baseId: {
			type: DataTypes.BIGINT,
		},
		assetId: {
			type: DataTypes.BIGINT,
		},
		fromWallet: {
			type: DataTypes.STRING,
		},
		toWallet: {
			type: DataTypes.BIGINT,
		},
		amount: {
			type: DataTypes.DECIMAL,
		},
		rate: {
			type: DataTypes.DECIMAL,
		},
		previousFromAmount: {
			type: DataTypes.DECIMAL,
		},
		previousToAmount: {
			type: DataTypes.DECIMAL,
		},
		txId: {
			type: DataTypes.STRING,
		},
		chainId: {
			type: DataTypes.INTEGER,
		},
		status: {
			type: DataTypes.ENUM("AUDITING", "PENDING", "REJECTED", "DONE"),
			defaultValue: "DONE",
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};

/*
 transactionType: {
 deposit: 1,
 withdraw: 2,
 },
 transactionStatus: {
 auditing: 1,
 pending: 2,
 rejected: 3,
 done: 4,
 }
 */
