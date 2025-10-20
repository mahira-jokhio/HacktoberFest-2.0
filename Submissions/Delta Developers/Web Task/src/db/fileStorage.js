class FileStorage {
  constructor() {
    this.storageKey = 'shopEaseStoreData';
    this.initializeStorage();
  }

  initializeStorage() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      const initialData = {
        products: [],
        sales: [],
        employees: [],
        customers: [],
        attendance: [],
        stockMovements: [],
        users: [],
        metadata: {
          version: '1.0.0',
          lastModified: new Date().toISOString()
        }
      };
      this.saveData(initialData);
      this.seedDefaultUsers();
    } else {
      // Check if users collection exists and seed if empty
      const data = JSON.parse(existingData);
      if (!data.users || data.users.length === 0) {
        this.seedDefaultUsers();
      }
    }
  }


  seedDefaultUsers() {
    const defaultUsers = [
      {
        username: 'admin',
        password: 'admin123', // In production, this should be hashed
        role: 'admin',
        name: 'Administrator'
      },
      {
        username: 'cashier',
        password: 'cashier123',
        role: 'cashier',
        name: 'Cashier User'
      }
    ];
    
    defaultUsers.forEach(user => {
      this.addItem('users', user);
    });
  }

  // Get all data from storage
  getData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  // Save all data to storage
  saveData(data) {
    data.metadata.lastModified = new Date().toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(data, null, 2));
  }

  // Get data for a specific collection
  getCollection(collectionName) {
    const data = this.getData();
    return data ? data[collectionName] || [] : [];
  }

  // Save data for a specific collection
  saveCollection(collectionName, items) {
    const data = this.getData();
    data[collectionName] = items;
    this.saveData(data);
  }

  // Add item to collection
  addItem(collectionName, item) {
    const items = this.getCollection(collectionName);
    const newItem = {
      ...item,
      id: this.generateId(items)
    };
    items.push(newItem);
    this.saveCollection(collectionName, items);
    return newItem;
  }

  // Add multiple items to collection
  bulkAdd(collectionName, itemsToAdd) {
    const items = this.getCollection(collectionName);
    const newItems = itemsToAdd.map(item => ({
      ...item,
      id: this.generateId(items)
    }));
    items.push(...newItems);
    this.saveCollection(collectionName, items);
    return newItems;
  }

  // Update item in collection
  updateItem(collectionName, id, updates) {
    const items = this.getCollection(collectionName);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.saveCollection(collectionName, items);
      return items[index];
    }
    return null;
  }

  // Delete item from collection
  deleteItem(collectionName, id) {
    const items = this.getCollection(collectionName);
    const filteredItems = items.filter(item => item.id !== id);
    this.saveCollection(collectionName, filteredItems);
    return filteredItems.length < items.length;
  }

  // Delete multiple items from collection
  bulkDelete(collectionName, ids) {
    const items = this.getCollection(collectionName);
    const filteredItems = items.filter(item => !ids.includes(item.id));
    this.saveCollection(collectionName, filteredItems);
    return items.length - filteredItems.length;
  }

  // Query items by field value
  where(collectionName, field, value) {
    const items = this.getCollection(collectionName);
    return items.filter(item => item[field] === value);
  }

  // Get item by id
  getItem(collectionName, id) {
    const items = this.getCollection(collectionName);
    return items.find(item => item.id === id);
  }

  // Generate unique ID for items
  generateId(existingItems) {
    if (existingItems.length === 0) return 1;
    const maxId = Math.max(...existingItems.map(item => item.id || 0));
    return maxId + 1;
  }

  // Export data to JSON file
  exportToFile() {
    const data = this.getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shopease-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Import data from JSON file
  async importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          // Validate data structure
          if (this.validateDataStructure(importedData)) {
            this.saveData(importedData);
            resolve(importedData);
          } else {
            reject(new Error('Invalid data structure'));
          }
        } catch (error) {
          reject(new Error('Failed to parse JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Validate imported data structure
  validateDataStructure(data) {
    const requiredCollections = ['products', 'sales', 'employees', 'customers', 'attendance', 'stockMovements', 'users'];
    return requiredCollections.every(collection => Array.isArray(data[collection]));
  }

  // Clear all data
  clearAllData() {
    localStorage.removeItem(this.storageKey);
    this.initializeStorage();
  }

  // Get storage size
  getStorageSize() {
    const data = localStorage.getItem(this.storageKey);
    return data ? new Blob([data]).size : 0;
  }
}

// Create singleton instance
export const fileStorage = new FileStorage();

// Collection-specific APIs
export const productsAPI = {
  getAll: () => fileStorage.getCollection('products'),
  add: (product) => fileStorage.addItem('products', product),
  bulkAdd: (products) => fileStorage.bulkAdd('products', products),
  update: (id, updates) => fileStorage.updateItem('products', id, updates),
  delete: (id) => fileStorage.deleteItem('products', id),
  get: (id) => fileStorage.getItem('products', id)
};

export const salesAPI = {
  getAll: () => fileStorage.getCollection('sales'),
  add: (sale) => fileStorage.addItem('sales', sale),
  bulkAdd: (sales) => fileStorage.bulkAdd('sales', sales),
  update: (id, updates) => fileStorage.updateItem('sales', id, updates),
  delete: (id) => fileStorage.deleteItem('sales', id),
  get: (id) => fileStorage.getItem('sales', id)
};

export const employeesAPI = {
  getAll: () => fileStorage.getCollection('employees'),
  add: (employee) => fileStorage.addItem('employees', employee),
  bulkAdd: (employees) => fileStorage.bulkAdd('employees', employees),
  update: (id, updates) => fileStorage.updateItem('employees', id, updates),
  delete: (id) => fileStorage.deleteItem('employees', id),
  get: (id) => fileStorage.getItem('employees', id)
};

export const customersAPI = {
  getAll: () => fileStorage.getCollection('customers'),
  add: (customer) => fileStorage.addItem('customers', customer),
  bulkAdd: (customers) => fileStorage.bulkAdd('customers', customers),
  update: (id, updates) => fileStorage.updateItem('customers', id, updates),
  delete: (id) => fileStorage.deleteItem('customers', id),
  get: (id) => fileStorage.getItem('customers', id)
};

export const attendanceAPI = {
  getAll: () => fileStorage.getCollection('attendance'),
  add: (record) => fileStorage.addItem('attendance', record),
  bulkAdd: (records) => fileStorage.bulkAdd('attendance', records),
  update: (id, updates) => fileStorage.updateItem('attendance', id, updates),
  delete: (id) => fileStorage.deleteItem('attendance', id),
  get: (id) => fileStorage.getItem('attendance', id)
};

export const stockMovementsAPI = {
  getAll: () => fileStorage.getCollection('stockMovements'),
  add: (movement) => fileStorage.addItem('stockMovements', movement),
  bulkAdd: (movements) => fileStorage.bulkAdd('stockMovements', movements),
  update: (id, updates) => fileStorage.updateItem('stockMovements', id, updates),
  delete: (id) => fileStorage.deleteItem('stockMovements', id),
  get: (id) => fileStorage.getItem('stockMovements', id)
};

export const usersAPI = {
  getAll: () => fileStorage.getCollection('users'),
  add: (user) => fileStorage.addItem('users', user),
  bulkAdd: (users) => fileStorage.bulkAdd('users', users),
  update: (id, updates) => fileStorage.updateItem('users', id, updates),
  delete: (id) => fileStorage.deleteItem('users', id),
  get: (id) => fileStorage.getItem('users', id),
  findByUsername: (username) => {
    const users = fileStorage.getCollection('users');
    return users.find(user => user.username === username);
  }
};
