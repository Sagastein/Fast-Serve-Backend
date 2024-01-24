const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tel: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.STRING,
      validate: {
        isIn: [["Male", "Female"]],
      },
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["user", "admin"]],
      },
      defaultValue: "user",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      get() {
        return moment(this.getDataValue("createdAt")).format(
          "DD-MM-YYYY HH:mm:ss"
        );
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      get() {
        return moment(this.getDataValue("updatedAt")).format(
          "DD-MM-YYYY HH:mm:ss"
        );
      },
    },
  });
  Users.addScope(
    "defaultScope",
    {
      order: [["createdAt", "DESC"]],
    },
    { override: true }
  );
  Users.associate = (models) => {
    Users.hasOne(models.Account, { foreignKey: "UserId" });
  };

  return Users;
};
