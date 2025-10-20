import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Product = sequelize.define("Product", {
  name: DataTypes.STRING,
  sku: { type: DataTypes.STRING, unique: true },
  category: DataTypes.STRING,
  price: DataTypes.FLOAT,
  quantity: DataTypes.INTEGER
});

export default Product;
