const moment = require("moment");
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define("Account", {
    UserId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    UUID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    AccountBalance: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        isIn: [["Active", "Blocked"]],
      },
      defaultValue: "Active",
      allowNull: false,
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

  Account.associate = function (models) {
    Account.hasMany(models.Transaction, {
      foreignKey: {
        name: "UserId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        allowNull: false,
      },
    });
  };
  //chat gpt
  // Account.associate = (models) => {
  //   Account.hasMany(models.Transaction,{
  //     foreignKey: 'id',
  //   });
  // };

  Account.associate = function (models) {
    Account.belongsTo(models.Users, {
      foreignKey: "UserId",
    });
  };

  return Account;
};
