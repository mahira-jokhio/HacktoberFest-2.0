// SIGN UP
const nameInput = document.querySelector('.signup-name');
const emailInput = document.querySelector('.signup-email');
const passwordInput = document.querySelector('.signup-password');
const confirmPasswordInput = document.querySelector('.signup-confirmpassword');
const signupBtn = document.querySelector('.signupbtn');

if (signupBtn) {
    signupBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const role = document.querySelector('input[name="role"]:checked');

        if (!name || !email || !password || !confirmPassword || !role) {
            alert('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            alert('This email is already registered.');
            return;
        }

        const newUser = {
            name: name,
            email: email,
            password: password,
            role: role.value
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Account created successfully!');
        window.location.href = 'index.html';
    });
}

// LOGIN
const loginEmail = document.querySelector('.login-mail-input');
const loginPassword = document.querySelector('.login-password-input');
const loginBtn = document.querySelector('.logbtn');

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();

        if (!email || !password) {
            alert('Please fill in both email and password.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            alert('Invalid email or password.');
            return;
        }

        localStorage.setItem('loggedInUser', JSON.stringify(user));
        alert(`Welcome back, ${user.name}!`);

        if (user.role === 'admin') {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'sales.html';
        }
    });
}
// PRODUCT MANAGEMENT (Admin)
const productName = document.querySelector('.Product-Name');
const productCategory = document.querySelector('.Product-Category');
const productId = document.querySelector('.Product-Id');
const productPrice = document.querySelector('.Product-Price');
const productQuantity = document.querySelector('.Product-Quantity');
const addBtn = document.querySelector('.Add-Product');
const productTable = document.getElementById('Product-Table'); 
const searchInput = document.querySelector('.Search'); 

let products = JSON.parse(localStorage.getItem('products')) || [];
let isEditing = false;
let editingIndex = -1;

if (addBtn) {
    addBtn.addEventListener('click', () => {
        if (!productId.value || !productName.value || !productCategory.value || !productPrice.value || !productQuantity.value) {
            alert('Please fill all product fields.');
            return;
        }

        if (isEditing) {
            products[editingIndex] = {
                id: productId.value,
                name: productName.value,
                category: productCategory.value,
                price: parseFloat(productPrice.value),
                quantity: parseInt(productQuantity.value)
            };
            
            localStorage.setItem('products', JSON.stringify(products));
            renderProducts();
            resetProductForm();
            alert('Product updated successfully!');
        } else {
            const existingProduct = products.find(p => p.id === productId.value);
            if (existingProduct) {
                alert('Product ID already exists!');
                return;
            }

            const newProduct = {
                id: productId.value,
                name: productName.value,
                category: productCategory.value,
                price: parseFloat(productPrice.value),
                quantity: parseInt(productQuantity.value)
            };

            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));
            renderProducts();

            productId.value = '';
            productName.value = '';
            productCategory.value = '';
            productPrice.value = '';
            productQuantity.value = '';
            
            alert('Product added successfully!');
        }
    });
}

function resetProductForm() {
    productId.value = '';
    productName.value = '';
    productCategory.value = '';
    productPrice.value = '';
    productQuantity.value = '';
    addBtn.textContent = 'Add Product';
    isEditing = false;
    editingIndex = -1;
}

function renderProducts() {
    if (!productTable) return;
    productTable.innerHTML = '';
    
    if (products.length === 0) {
        productTable.innerHTML = `
            <tr>
                <td>—</td>
                <td>No products added</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td>
                    <button class="Product-Edit" disabled>Edit</button>
                    <button class="Product-Remove" disabled>Remove</button>
                </td>
            </tr>`;
        return;
    }

    products.forEach((p, index) => {
        const row = document.createElement('tr');
        if (p.quantity < 5) {
            row.classList.add('low-stock');
        }
        
        row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>$${p.price.toFixed(2)}</td>
            <td>${p.quantity}</td>
            <td>
                <button class="Product-Edit" onclick="editProduct(${index})">Edit</button>
                <button class="Product-Remove" onclick="removeProduct(${index})">Remove</button>
            </td>`;
        productTable.appendChild(row);
    });
}

window.removeProduct = function (index) {
    if (confirm('Are you sure you want to remove this product?')) {
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
    }
};

window.editProduct = function (index) {
    const product = products[index];
    productId.value = product.id;
    productName.value = product.name;
    productCategory.value = product.category;
    productPrice.value = product.price;
    productQuantity.value = product.quantity;
    
    isEditing = true;
    editingIndex = index;
    addBtn.textContent = 'Update Product';
};

if (searchInput) {
    searchInput.addEventListener('keyup', () => {
        const value = searchInput.value.toLowerCase();
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(value) ||
            p.id.toLowerCase().includes(value) ||
            p.category.toLowerCase().includes(value)
        );
        renderFilteredProducts(filtered);
    });
}

function renderFilteredProducts(filtered) {
    if (!productTable) return;
    productTable.innerHTML = '';
    
    if (filtered.length === 0) {
        productTable.innerHTML = `
            <tr>
                <td colspan="6">No products found</td>
            </tr>`;
        return;
    }

    filtered.forEach((p, index) => {
        const originalIndex = products.findIndex(prod => prod.id === p.id);
        const row = document.createElement('tr');
        if (p.quantity < 5) {
            row.classList.add('low-stock');
        }
        
        row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>$${p.price.toFixed(2)}</td>
            <td>${p.quantity}</td>
            <td>
                <button class="Product-Edit" onclick="editProduct(${originalIndex})">Edit</button>
                <button class="Product-Remove" onclick="removeProduct(${originalIndex})">Remove</button>
            </td>`;
        productTable.appendChild(row);
    });
}

// SALES SECTION (User)
const productDropdown = document.querySelector('.product-dropdown');
const quantityInput = document.querySelector('.quantity-input');
const addCartBtn = document.querySelector('.add-cart-btn');
const cartTable = document.querySelector('.cart-table');
const subtotalElement = document.querySelector('.subtotal');
const taxElement = document.querySelector('.tax');
const grandTotalElement = document.querySelector('.grand-total');
const checkoutBtn = document.querySelector('.checkoutbtn');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

if (productDropdown) {
    function populateProductDropdown() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        productDropdown.innerHTML = '<option value="">-- Choose Product --</option>';
        
        products.forEach(product => {
            if (product.quantity > 0) {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} - $${product.price} (Stock: ${product.quantity})`;
                option.dataset.product = JSON.stringify(product);
                productDropdown.appendChild(option);
            }
        });
    }
    
    populateProductDropdown();
}

if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
        const selectedOption = productDropdown.options[productDropdown.selectedIndex];
        const quantity = parseInt(quantityInput.value);
        
        if (!selectedOption.value) {
            alert('Please select a product.');
            return;
        }
        
        if (!quantity || quantity <= 0) {
            alert('Please enter a valid quantity.');
            return;
        }
        
        const product = JSON.parse(selectedOption.dataset.product);
        
        if (quantity > product.quantity) {
            alert(`Only ${product.quantity} items available in stock.`);
            return;
        }
        
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        quantityInput.value = '';
        productDropdown.selectedIndex = 0;
    });
}

function renderCart() {
    if (!cartTable) return;
    cartTable.innerHTML = '';
    
    if (cart.length === 0) {
        cartTable.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center;">Cart is empty</td>
            </tr>`;
        updateTotals();
        return;
    }
    
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        const total = item.price * item.quantity;
        
        row.innerHTML = `
            <td data-label="Product">${item.name}</td>
            <td data-label="Price">$${item.price.toFixed(2)}</td>
            <td data-label="Qty">${item.quantity}</td>
            <td data-label="Total">$${total.toFixed(2)}</td>
            <td data-label="Action">
                <button class="remove-btn" onclick="removeCartItem(${index})">Remove</button>
            </td>`;
        cartTable.appendChild(row);
    });
    
    updateTotals();
}

window.removeCartItem = function (index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
};

function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10;
    const grandTotal = subtotal + tax;
    
    if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2);
    if (taxElement) taxElement.textContent = tax.toFixed(2);
    if (grandTotalElement) grandTotalElement.textContent = grandTotal.toFixed(2);
}

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Cart is empty!');
            return;
        }
        
        const products = JSON.parse(localStorage.getItem('products')) || [];
        let hasError = false;
        
        cart.forEach(cartItem => {
            const product = products.find(p => p.id === cartItem.id);
            if (product) {
                if (product.quantity < cartItem.quantity) {
                    alert(`Not enough stock for ${product.name}. Available: ${product.quantity}`);
                    hasError = true;
                    return;
                }
                product.quantity -= cartItem.quantity;
            }
        });
        
        if (hasError) return;
        
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const transaction = {
            id: 'T' + Date.now(),
            date: new Date().toLocaleDateString(),
            items: [...cart],
            subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            tax: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.10,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.10
        };
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        localStorage.setItem('products', JSON.stringify(products));
        
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        alert('Checkout successful!');
        renderCart();
        populateProductDropdown();
    });
}
// DASHBOARD UPDATES
function updateDashboard() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    const totalProductsElement = document.getElementById('totalProducts');
    const totalSalesElement = document.getElementById('totalSales');
    const lowStockElement = document.getElementById('lowStock');
    const totalRevenueElement = document.getElementById('totalRevenue');
    
    if (totalProductsElement) {
        totalProductsElement.textContent = products.length;
    }
    
    if (totalSalesElement) {
        const today = new Date().toLocaleDateString();
        const todaySales = transactions.filter(t => t.date === today).length;
        totalSalesElement.textContent = todaySales;
    }
    
    if (lowStockElement) {
        const lowStockCount = products.filter(p => p.quantity < 5).length;
        lowStockElement.textContent = lowStockCount;
    }
    
    if (totalRevenueElement) {
        const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
        totalRevenueElement.textContent = `$${totalRevenue.toFixed(2)}`;
    }
    
    const transactionTable = document.getElementById('transactionTable');
    if (transactionTable) {
        transactionTable.innerHTML = '';
        const recentTransactions = transactions.slice(-5).reverse();
        
        if (recentTransactions.length === 0) {
            transactionTable.innerHTML = `
                <tr>
                    <td>—</td>
                    <td>No transactions yet</td>
                    <td>—</td>
                    <td>—</td>
                    <td>—</td>
                </tr>`;
        } else {
            recentTransactions.forEach(transaction => {
                transaction.items.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${transaction.date}</td>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>$${(item.price * item.quantity).toFixed(2)}</td>
                        <td>System</td>`;
                    transactionTable.appendChild(row);
                });
            });
        }
    }
    
    const topSellingList = document.getElementById('topSellingList');
    if (topSellingList) {
        topSellingList.innerHTML = '';
        
        const productSales = {};
        transactions.forEach(transaction => {
            transaction.items.forEach(item => {
                if (!productSales[item.name]) {
                    productSales[item.name] = 0;
                }
                productSales[item.name] += item.quantity;
            });
        });
        
        const topProducts = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        if (topProducts.length === 0) {
            topSellingList.innerHTML = '<li>No sales data yet</li>';
        } else {
            topProducts.forEach(([product, sales]) => {
                const li = document.createElement('li');
                li.textContent = `${product} - ${sales} sold`;
                topSellingList.appendChild(li);
            });
        }
    }
}

// ==========================
// REPORTS PAGE
// ==========================
function initializeReports() {
    const filterBtn = document.querySelector('.filterbtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', generateReport);
    }
    initializeExportButtons();
}

function generateReport() {
    const startDate = document.querySelector('.start-date')?.value;
    const endDate = document.querySelector('.end-date')?.value;
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    let filteredTransactions = transactions;
    
    if (startDate && endDate) {
        filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return transactionDate >= start && transactionDate <= end;
        });
    }
    
    updateReportSummary(filteredTransactions);
    populateReportTable(filteredTransactions);
}

function updateReportSummary(transactions) {
    const totalSalesElement = document.querySelector('.total-sales');
    const totalProductsElement = document.querySelector('.total-products');
    const topProductElement = document.querySelector('.top-product');
    
    if (totalSalesElement) {
        const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
        totalSalesElement.textContent = totalSales.toFixed(2);
    }
    
    if (totalProductsElement) {
        const totalProducts = transactions.reduce((sum, t) => 
            sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
        totalProductsElement.textContent = totalProducts;
    }
    
    if (topProductElement) {
        const productSales = {};
        transactions.forEach(transaction => {
            transaction.items.forEach(item => {
                if (!productSales[item.name]) {
                    productSales[item.name] = 0;
                }
                productSales[item.name] += item.quantity;
            });
        });
        
        const topProduct = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])[0];
        
        topProductElement.textContent = topProduct ? `${topProduct[0]} (${topProduct[1]} sold)` : '—';
    }
}

function populateReportTable(transactions) {
    const reportTable = document.querySelector('.report-table');
    if (!reportTable) return;
    
    reportTable.innerHTML = '';
    
    if (transactions.length === 0) {
        reportTable.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center;">No transactions in selected period</td>
            </tr>`;
        return;
    }
    
    transactions.forEach(transaction => {
        transaction.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Date">${transaction.date}</td>
                <td data-label="Product">${item.name}</td>
                <td data-label="Quantity">${item.quantity}</td>
                <td data-label="Total">$${(item.price * item.quantity).toFixed(2)}</td>`;
            reportTable.appendChild(row);
        });
    });
}

// CSV EXPORT FUNCTIONALITY
function exportToCSV() {
    const startDate = document.querySelector('.start-date')?.value;
    const endDate = document.querySelector('.end-date')?.value;
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    let filteredTransactions = transactions;
    
    if (startDate && endDate) {
        filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return transactionDate >= start && transactionDate <= end;
        });
    }
    
    if (filteredTransactions.length === 0) {
        alert('No data available to export!');
        return;
    }
    
    let csvContent = "Date,Transaction ID,Product,Quantity,Price,Total\n";
    
    filteredTransactions.forEach(transaction => {
        transaction.items.forEach(item => {
            const row = [
                `"${transaction.date}"`,
                `"${transaction.id}"`,
                `"${item.name}"`,
                item.quantity,
                item.price.toFixed(2),
                (item.price * item.quantity).toFixed(2)
            ].join(',');
            
            csvContent += row + '\n';
        });
    });
    
    const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
    const totalProducts = filteredTransactions.reduce((sum, t) => 
        sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    
    csvContent += '\n';
    csvContent += 'Summary\n';
    csvContent += `Total Sales,$${totalSales.toFixed(2)}\n`;
    csvContent += `Total Products Sold,${totalProducts}\n`;
    csvContent += `Number of Transactions,${filteredTransactions.length}\n`;
    csvContent += `Report Generated,${new Date().toLocaleString()}\n`;
    
    downloadCSV(csvContent, 'sales_report.csv');
}

function exportToPDF() {
    alert('PDF export would require additional libraries like jsPDF. CSV export is ready to use!');
}

function initializeExportButtons() {
    const csvBtn = document.querySelector('.csv-btn');
    const pdfBtn = document.querySelector('.pdf-btn');
    
    if (csvBtn) {
        csvBtn.addEventListener('click', exportToCSV);
    }
    
    if (pdfBtn) {
        pdfBtn.addEventListener('click', exportToPDF);
    }
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==========================
// SINGLE WINDOW.LOAD FUNCTION
// ==========================
window.onload = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const currentPage = window.location.pathname;

    if (!loggedInUser && !currentPage.includes('index.html') && !currentPage.includes('signup.html')) {
        window.location.href = 'index.html';
        return;
    }

    if (document.getElementById('Product-Table')) {
        renderProducts();
    }
    
    if (document.querySelector('.cart-table')) {
        renderCart();
    }
    
    if (document.querySelector('.DashBox')) {
        updateDashboard();
    }
    
    if (document.querySelector('.report-table')) {
        initializeReports();
        generateReport();
    }
};

setInterval(() => {
    if (document.querySelector('.DashBox')) {
        updateDashboard();
    }
}, 30000);