const moment = require("moment");
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("Transaction", {
    UUID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    mode: {
      type: DataTypes.STRING,
      validate: {
        isIn: [["Debit", "Credit"]],
      },
      defaultValue: "Debit",
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      get() {
        return moment(this.getDataValue("createdAt")).format(
          "DD-MM-YYYY HH:mm:ss a"
        );
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      get() {
        return moment(this.getDataValue("updatedAt")).format(
          "Do,MMM YY, h:mm a"
        );
      },
    },
  });
  // Transaction.associate = function (models) {
  //   Transaction.belongsTo(models.Account);
  // };
  Transaction.associate = function (models) {
    Transaction.belongsTo(models.Account, {
      foreignKey: {
        name: "UserId",

        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Transaction.addScope(
      "defaultScope",
      // {
      //   order: [["createdAt", "DESC"]],
      // },
      { override: true }
    );
  };
  return Transaction;
};
