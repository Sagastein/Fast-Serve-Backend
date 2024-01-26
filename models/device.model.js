const moment = require("moment");
module.exports = (sequelize, Datatype) => {
  const Device = sequelize.define("Device", {
    id: {
      type: Datatype.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Datatype.STRING,
      allowNull: false,
    },
    price: {
      type: Datatype.INTEGER,
      allowNull: false,
    },
    location: {
      type: Datatype.STRING,
      allowNull: false,
    },
    //device mode can be register or withdraw
    mode: {
      type: Datatype.STRING,
      allowNull: false,
      validate: {
        isIn: [["register", "withdraw"]],
      },
      defaultValue: "register",
    },
    status: {
      type: Datatype.STRING,
      allowNull: false,
      validate: {
        isIn: [["active", "blocked"]],
      },
      defaultValue: "active",
    },

    createdAt: {
      type: Datatype.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      get() {
        return moment(this.getDataValue("createdAt")).format(
          "DD-MM-YYYY HH:mm:ss a"
        );
      },
    },
    updatedAt: {
      type: Datatype.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      get() {
        return moment(this.getDataValue("updatedAt")).format(
          "Do,MMM YY, h:mm a"
        );
      },
    },
  });

  return Device;
};
