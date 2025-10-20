import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Sale = sequelize.define("Sale", {
  productName: DataTypes.STRING,
  quantitySold: DataTypes.INTEGER,
  totalAmount: DataTypes.FLOAT
});

export default Sale;
