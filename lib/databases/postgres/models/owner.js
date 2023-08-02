const { DataTypes } = require("sequelize");

module.exports = {
    attributes: {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        from: {
            type: DataTypes.STRING
        },
        to: {
            type: DataTypes.STRING
        },
        tokenId: {
            type: DataTypes.BIGINT
        },
        action: {
            type: DataTypes.ENUM("MINT", "BURN" , "TRANSFER" , "WITHDRAW" , "DEPOSIT"),
            defaultValue: "TRANSFER",
        },
        txId: {
            type: DataTypes.STRING
        },
        blockNumber: {
            type: DataTypes.BIGINT
        }
    },
    options: {
        timestamps: true,
        paranoid: true
    }
};
