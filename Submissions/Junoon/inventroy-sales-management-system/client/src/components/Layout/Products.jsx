import React, { useState, useEffect } from "react";
import ProductCard from "../ProductCard";
import axios from "axios";
import { toast, Toaster } from "sonner";

const Products = () => {
  const [products, setProducts] = useState([]);
  const lowStockShownRef = React.useRef(false);
  const [form, setForm] = useState({ name: "", price: "" });
  const [editId, setEditId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Toast for low stock (<=5 and >0), only once per session
    const lowStockItems = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5);
    if (lowStockItems.length > 0 && !lowStockShownRef.current) {
      toast.warning(
        `Low stock: ${lowStockItems.map(item => `${item.name} (${item.stock})`).join(", ")}`,
        {
          icon: "⚠️",
          duration: 5000,
        }
      );
      lowStockShownRef.current = true;
    }
  }, [products]);


  const API_URL = "http://localhost:3000/api/products";
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [toastt, setToastt] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });

  // Get user from localStorage directly
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })();

  const isAdmin = user && user.role === "admin";

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data.data);
      // Extract unique categories
      const cats = Array.from(new Set(res.data.data.map(p => p.category).filter(Boolean)));
      setCategories(cats);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.log("DELETE ERROR:", error.response?.data || error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/products/${editId}`,
        {
          ...newProduct,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
        }
      );
      setShowModal(false);
      setEditId(null);
      fetchProducts();
      setToastt(true);
      setTimeout(() => setToastt(false), 2000);
      setNewProduct({
        name: "",
        sku: "",
        category: "",
        price: "",
        stock: "",
        image: "",
      });
    } catch (error) {
      console.log("UPDATE ERROR:", error.response?.data || error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setNewProduct({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
    });
    setShowModal(true);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/products/add-product", {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      });
      setShowModal(false);
      setToastt(true);
      fetchProducts();
      setTimeout(() => setToastt(false), 2000);
      setNewProduct({
        name: "",
        sku: "",
        category: "",
        price: "",
        stock: "",
        image: "",
      });
    } catch (error) {
      console.log("ADD ERROR:", error.response?.data || error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6">
      {/* Header + Add Button + Category Filter */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-[var(--text-color)]">Products</h2>
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 text-white w-60 outline-none"
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 text-white w-48 outline-none"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-[var(--primary-color)] text-white px-4 py-2 rounded hover:opacity-80 transition"
          >
            + Add Product
          </button>
        )}
      </div>

      {/* Grid View */}
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {products
          .filter((item) => {
            const matchesSearch =
              item.name.toLowerCase().includes(search.toLowerCase()) ||
              item.sku.toLowerCase().includes(search.toLowerCase()) ||
              item.category.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
            return matchesSearch && matchesCategory;
          })
          .map((item) => (
            <ProductCard
              key={item._id}
              product={item}
              onDelete={isAdmin ? () => handleDeleteProduct(item._id) : undefined}
              onView={() => console.log("View: ", item._id)}
            />
          ))}
      </div>

      {/* Popup Modal */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center">
          <div className="bg-[var(--secondary-color)] text-[var(--text-color)] p-6 rounded-md w-[90%] max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              {editId ? "Edit Product" : "Add Product"}
            </h3>
            <form onSubmit={editId ? handleUpdateProduct : handleAddProduct} className="space-y-3">
              <input
                className="w-full p-2 bg-gray-800 rounded"
                placeholder="Product Name"
                required
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                className="w-full p-2 bg-gray-800 rounded"
                placeholder="SKU"
                required
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
              />
              <input
                className="w-full p-2 bg-gray-800 rounded"
                placeholder="Category"
                required
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              />
              <input
                className="w-full p-2 bg-gray-800 rounded"
                type="number"
                placeholder="Price"
                required
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
              <input
                className="w-full p-2 bg-gray-800 rounded"
                type="number"
                placeholder="Stock"
                required
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              />
              <input
                className="w-full p-2 bg-gray-800 rounded"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1 bg-gray-600 rounded hover:opacity-80"
                >
                  Cancel
                </button>
                <button type="submit" className="px-3 py-1 bg-[var(--primary-color)] rounded hover:opacity-80">
                  {editId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Message */}
      {toastt && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          ✅ Product Added Successfully!
        </div>
      )}
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default Products;
