import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/database';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StockMovement = () => {
  const { products, refreshData } = useApp();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('in');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (!product) return;

    const qty = parseInt(quantity);
    const newQuantity = type === 'in' 
      ? product.quantity + qty 
      : product.quantity - qty;

    if (newQuantity < 0) {
      alert('Insufficient stock!');
      return;
    }

    // Update product quantity
    await db.products.update(product.id, { quantity: newQuantity });

    // Record stock movement
    await db.stockMovements.add({
      product_id: product.id,
      date: new Date().toISOString(),
      type: type,
      quantity: qty,
      notes: notes
    });

    refreshData();

    // Reset form
    setSelectedProduct('');
    setQuantity('');
    setNotes('');
    alert(`Stock ${type === 'in' ? 'added' : 'removed'} successfully!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock In / Out</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Add or remove stock from inventory
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Movement Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Record Stock Movement</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Movement Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="in"
                    checked={type === 'in'}
                    onChange={(e) => setType(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                    <TrendingUp size={18} className="text-green-600" />
                    Stock In
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="out"
                    checked={type === 'out'}
                    onChange={(e) => setType(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                    <TrendingDown size={18} className="text-red-600" />
                    Stock Out
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Product
              </label>
              <select
                required
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Choose a product...</option>
                {products?.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.sku} (Current: {product.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantity
              </label>
              <input
                type="number"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="Add any notes..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Record Movement
            </button>
          </form>
        </div>

        {/* Current Stock List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Current Stock Levels</h2>
          </div>
          <div className="p-6 max-h-[600px] overflow-y-auto">
            <div className="space-y-3">
              {products?.map(product => (
                <div
                  key={product.id}
                  className={`p-4 rounded-lg border-2 ${
                    product.quantity < 5
                      ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {product.sku} • {product.size} • {product.color}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 capitalize">
                        {product.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        product.quantity < 5
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {product.quantity}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">units</div>
                      {product.quantity < 5 && (
                        <div className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">
                          Low Stock!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockMovement;
