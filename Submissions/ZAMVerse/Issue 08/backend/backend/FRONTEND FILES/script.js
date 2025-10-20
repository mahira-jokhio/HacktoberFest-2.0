// ✅ Get form elements
const productForm = document.getElementById("productForm");
const salesForm = document.getElementById("salesForm");

// ✅ Get input fields for products
const nameInput = document.getElementById("name");
const skuInput = document.getElementById("sku");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const quantityInput = document.getElementById("quantity");

// ✅ Get input fields for sales
const saleSkuInput = document.getElementById("saleSku");
const saleQtyInput = document.getElementById("saleQty");

// ✅ Tables and summaries
const productTable = document.querySelector("#productTable tbody");
const salesSummary = document.getElementById("salesSummary");

// ✅ Local Storage data
let products = JSON.parse(localStorage.getItem("products")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];

// ✅ Render product table
function renderProducts() {
  productTable.innerHTML = "";
  products.forEach((p, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.sku}</td>
      <td>${p.category}</td>
      <td>${p.price}</td>
      <td>${p.quantity}</td>
      <td><button onclick="deleteProduct(${i})">Delete</button></td>
    `;
    productTable.appendChild(row);
  });
}

// ✅ Save data to localStorage
function saveData() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("sales", JSON.stringify(sales));
}

// ✅ Add product
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const product = {
    name: nameInput.value.trim(),
    sku: skuInput.value.trim(),
    category: categoryInput.value.trim(),
    price: parseFloat(priceInput.value),
    quantity: parseInt(quantityInput.value),
  };

  if (!product.name || !product.sku) {
    alert("Please fill in all fields.");
    return;
  }

  products.push(product);
  saveData();
  renderProducts();
  productForm.reset();
});

// ✅ Handle sales
salesForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const skuValue = saleSkuInput.value.trim();
  const qtyValue = parseInt(saleQtyInput.value);

  const product = products.find((p) => p.sku === skuValue);
  if (product && product.quantity >= qtyValue) {
    product.quantity -= qtyValue;
    sales.push({
      sku: skuValue,
      qty: qtyValue,
      total: qtyValue * product.price,
    });
    saveData();
    renderProducts();
    showSalesSummary();
    salesForm.reset();
  } else {
    alert("Invalid sale or insufficient stock.");
  }
});

// ✅ Delete product
function deleteProduct(i) {
  products.splice(i, 1);
  saveData();
  renderProducts();
}

// ✅ Sales summary
function showSalesSummary() {
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  salesSummary.innerText = "Total Revenue: $" + totalRevenue.toFixed(2);
}

// ✅ Initial render
renderProducts();
showSalesSummary();
