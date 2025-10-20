import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/database';
import { Plus, Trash2, ShoppingCart, Printer, X, Package, Search } from 'lucide-react';

const Billing = () => {
  const { products, customers, refreshData } = useApp();
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('walk-in');
  const [customCustomerName, setCustomCustomerName] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const receiptRef = useRef();

  const categories = ['all', 'garments', 'footwear', 'kids'];

  // Filter products based on search and category
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.color?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const inStock = product.quantity > 0;
    return matchesSearch && matchesCategory && inStock;
  }) || [];

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      if (existing.quantity >= product.quantity) {
        alert('Insufficient stock!');
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      if (product.quantity < 1) {
        alert('Product out of stock!');
        return;
      }
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.sell_price,
        cost: product.cost_price,
        quantity: 1,
        maxQuantity: product.quantity
      }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    const item = cart.find(i => i.id === id);
    if (newQuantity > item.maxQuantity) {
      alert('Insufficient stock!');
      return;
    }
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateCost = () => {
    return cart.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    if (!selectedCustomer) {
      alert('Please select a customer type!');
      return;
    }

    if (selectedCustomer === 'custom' && !customCustomerName.trim()) {
      alert('Please enter customer name!');
      return;
    }

    const total = calculateTotal();
    const cost = calculateCost();
    const profit = total - cost;

    // Determine customer info
    let customerName = 'Walk-in Customer';
    let customerId = null;

    if (selectedCustomer === 'walk-in') {
      customerName = 'Walk-in Customer';
    } else if (selectedCustomer === 'custom') {
      customerName = customCustomerName.trim();
    } else {
      // Existing customer from database
      customerId = parseInt(selectedCustomer);
      const customer = customers.find(c => c.id === customerId);
      customerName = customer ? customer.name : 'Unknown Customer';
    }

    // Create sale record
    const saleData = {
      date: new Date().toISOString(),
      customer_id: customerId,
      customer_name: customerName,
      total,
      cost,
      profit,
      items: cart.map(item => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        cost: item.cost
      }))
    };

    const saleId = await db.sales.add(saleData);

    // Update stock quantities
    for (const item of cart) {
      const product = products.find(p => p.id === item.id);
      await db.products.update(item.id, {
        quantity: product.quantity - item.quantity
      });
    }

    refreshData();

    // Prepare invoice data
    setLastInvoice({
      id: saleId.id,
      date: new Date(),
      customer: customerName,
      items: cart,
      total
    });

    // Clear cart
    setCart([]);
    setSelectedCustomer('walk-in');
    setCustomCustomerName('');
    setShowReceipt(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setLastInvoice(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing / POS</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Create invoices and process sales
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products List */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Available Products</h2>
              {(searchTerm || categoryFilter !== 'all') && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </span>
              )}
            </div>
            
            {/* Search and Filter */}
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, SKU, or color..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-colors whitespace-nowrap text-sm ${
                      categoryFilter === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-6 max-h-[600px] overflow-y-auto">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.size} • {product.color}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 capitalize">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        Rs. {product.sell_price}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Stock: {product.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Package size={48} className="text-gray-400 mb-4" />
                {searchTerm || categoryFilter !== 'all' ? (
                  <>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
                      No products match your search
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setCategoryFilter('all');
                      }}
                      className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    >
                      Clear filters
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
                      No products available in stock
                    </p>
                    <a
                      href="/products"
                      className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    >
                      Add Products →
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <ShoppingCart size={24} className="text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cart ({cart.length})</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Customer Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer
              </label>
              <select
                value={selectedCustomer}
                onChange={(e) => {
                  setSelectedCustomer(e.target.value);
                  if (e.target.value !== 'custom') {
                    setCustomCustomerName('');
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="walk-in">Walk-in Customer (Cash Sale)</option>
                <option value="custom">Enter Custom Name</option>
                {customers && customers.length > 0 && (
                  <optgroup label="Saved Customers">
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              {selectedCustomer === 'custom' && (
                <input
                  type="text"
                  placeholder="Enter customer name..."
                  value={customCustomerName}
                  onChange={(e) => setCustomCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              )}
            </div>

            {/* Cart Items */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Cart is empty
                </p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Rs. {item.price} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        Rs. {item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  Rs. {calculateTotal().toLocaleString()}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && lastInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sale Complete!</h2>
                <button onClick={closeReceipt} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                  <X size={24} />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Invoice generated successfully. Print receipt?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeReceipt}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Printer size={20} />
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt */}
      {lastInvoice && (
        <div className="print-area" ref={receiptRef}>
          <div style={{ width: '72mm', padding: '10mm', fontFamily: 'monospace', fontSize: '12px' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px', borderBottom: '2px dashed #000', paddingBottom: '10px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 5px 0' }}>SHOPEASE</h1>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Management System</p>
              <p style={{ margin: '2px 0', fontSize: '11px' }}>Thank you for shopping!</p>
            </div>
            
            <div style={{ marginBottom: '10px', fontSize: '11px' }}>
              <p style={{ margin: '2px 0' }}><strong>Invoice #:</strong> {lastInvoice.id}</p>
              <p style={{ margin: '2px 0' }}><strong>Date:</strong> {lastInvoice.date.toLocaleString()}</p>
              <p style={{ margin: '2px 0' }}><strong>Customer:</strong> {lastInvoice.customer}</p>
            </div>

            <div style={{ borderTop: '2px dashed #000', borderBottom: '2px dashed #000', padding: '10px 0', marginBottom: '10px' }}>
              <table style={{ width: '100%', fontSize: '11px' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', paddingBottom: '5px' }}>Item</th>
                    <th style={{ textAlign: 'center', paddingBottom: '5px' }}>Qty</th>
                    <th style={{ textAlign: 'right', paddingBottom: '5px' }}>Price</th>
                    <th style={{ textAlign: 'right', paddingBottom: '5px' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lastInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ paddingTop: '3px' }}>{item.name}</td>
                      <td style={{ textAlign: 'center', paddingTop: '3px' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right', paddingTop: '3px' }}>{item.price}</td>
                      <td style={{ textAlign: 'right', paddingTop: '3px' }}>{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong>TOTAL:</strong>
                <strong>Rs. {lastInvoice.total.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'center', borderTop: '2px dashed #000', paddingTop: '10px', fontSize: '11px' }}>
              <p style={{ margin: '2px 0' }}>Thank you for your business!</p>
              <p style={{ margin: '2px 0' }}>Please visit again</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
