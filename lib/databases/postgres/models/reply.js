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
    ticketId: {
      type: DataTypes.BIGINT,
    },
    text: {
      type: DataTypes.TEXT,
    },
    userId: {
      type: DataTypes.BIGINT,
    },
    managerId: {
      type: DataTypes.BIGINT,
    },
    file: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  options: {
    timestamps: true,
    paranoid: true,
  },
};
