let products = [];
let totalSales = 0;
let totalProfit = 0;

const form = document.getElementById('productForm');
const tableBody = document.querySelector('#inventoryTable tbody');
const totalSalesEl = document.getElementById('totalSales');
const totalProfitEl = document.getElementById('totalProfit');
const produceBtn = document.getElementById('produceSummaryBtn');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  const price = parseFloat(document.getElementById('price').value);
  const quantity = parseInt(document.getElementById('quantity').value);

  if (name && category && price > 0 && quantity > 0) {
    const product = { 
      name, 
      category, 
      price, 
      startQty: quantity,   
      currentQty: quantity 
    };
    products.push(product);
    displayProducts();
    form.reset();
  } else {
    alert("Please fill all fields correctly!");
  }
});

function displayProducts() {
  tableBody.innerHTML = "";
  products.forEach((p, index) => {
    const row = `
      <tr>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>$${p.price}</td>
        <td>${p.startQty}</td>
        <td>${p.currentQty}</td>
        <td>
          <button onclick="sellProduct(${index})">Sell</button>
          <button onclick="deleteProduct(${index})">Delete</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

function sellProduct(i) {
  let product = products[i];
  if (product.currentQty > 0) {
    product.currentQty--;
    totalSales += product.price;
    totalProfit += product.price * 0.15; // assuming 15% profit
    displayProducts();
  } else {
    alert("Out of stock!");
  }
}

function deleteProduct(i) {
  products.splice(i, 1);
  displayProducts();
}


produceBtn.addEventListener('click', () => {
  totalSalesEl.textContent = `$${totalSales.toFixed(2)}`;
  totalProfitEl.textContent = `$${totalProfit.toFixed(2)}`;
  alert("✅ Sales summary produced!");
});