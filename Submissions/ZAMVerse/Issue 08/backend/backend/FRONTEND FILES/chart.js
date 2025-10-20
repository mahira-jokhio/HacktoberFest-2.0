const salesURL = "http://localhost:5000/api/sales";
const form = document.getElementById("saleForm");
const tbody = document.querySelector("#salesTable tbody");

async function loadSales() {
  const res = await fetch(salesURL);
  const sales = await res.json();

  tbody.innerHTML = sales.map(s =>
    `<tr><td>${s.productName}</td><td>${s.quantitySold}</td><td>${s.totalAmount}</td></tr>`
  ).join("");

  const labels = sales.map(s => s.productName);
  const totals = sales.map(s => s.totalAmount);

  new Chart(document.getElementById("salesChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Sales Amount ($)",
        data: totals,
        backgroundColor: "rgba(54,162,235,0.6)"
      }]
    }
  });
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const sale = {
    productName: productName.value,
    quantitySold: parseInt(quantitySold.value),
    totalAmount: parseFloat(totalAmount.value)
  };
  await fetch(salesURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sale)
  });
  form.reset();
  loadSales();
});

loadSales();
