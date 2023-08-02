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
    },
    managerId: {
      type: DataTypes.BIGINT,
    },
    title: {
      type: DataTypes.STRING(300),
    },
    text: {
      type: DataTypes.TEXT,
    },
    note: {
      type: DataTypes.TEXT,
    },
    tag: {
      type: DataTypes.ARRAY(DataTypes.STRING(250)),
    },
    code: {
      type: DataTypes.STRING(250),
    },
    priority: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("CREATED", "REPLIED", "PENDING", "CLOSED"),
      default: "CREATED",
      allowNull: false,
    },
    departmentId: {
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
