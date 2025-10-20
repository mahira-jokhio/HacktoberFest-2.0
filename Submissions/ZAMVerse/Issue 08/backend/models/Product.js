// backend/models/Product.js
import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  category: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
});

export default Product;
