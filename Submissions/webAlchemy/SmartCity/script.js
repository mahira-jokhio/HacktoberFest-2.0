// ---------- UI (show/hide) functions ----------
function showPortal(role) {
  // hide role selection, show portal section
  const roleSection = document.getElementById('role-selection');
  const portalSection = document.getElementById('portal-section');
  if (roleSection) roleSection.classList.add('hidden');
  if (portalSection) portalSection.classList.remove('hidden');

  // hide all portals, show the requested one
  const portals = document.querySelectorAll('.portal');
  portals.forEach(p => p.classList.add('hidden'));
  const target = document.getElementById(role + '-portal');
  if (target) target.classList.remove('hidden');
}

function goBack() {
  const roleSection = document.getElementById('role-selection');
  const portalSection = document.getElementById('portal-section');
  if (portalSection) portalSection.classList.add('hidden');
  if (roleSection) roleSection.classList.remove('hidden');
}

// ---------- Make UI functions global (so onclick in HTML works) ----------
window.showPortal = showPortal;
window.goBack = goBack;

// ---------- Firebase Firestore functions (imported as module) ----------
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// NOTE: index.html initializes Firebase and sets window.db = db
const db = window.db; // Firestore instance

// If db is not ready yet, functions will wait until it is set
function ensureDbReady(timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (window.db) return resolve(window.db);
    const start = Date.now();
    const iv = setInterval(() => {
      if (window.db) {
        clearInterval(iv);
        return resolve(window.db);
      }
      if (Date.now() - start > timeout) {
        clearInterval(iv);
        return reject(new Error('Timed out waiting for Firestore (window.db)'));
      }
    }, 100);
  });
}

// Add a new zone to Firestore
async function addZone() {
  const zoneInput = document.getElementById("zoneName");
  const zoneName = zoneInput ? zoneInput.value.trim() : "";
  if (!zoneName) {
    alert("Please enter a zone name!");
    return;
  }

  try {
    await ensureDbReady();
    await addDoc(collection(window.db, "zones"), {
      name: zoneName,
      status: "Pending",
      createdAt: new Date()
    });
    alert("✅ Zone added successfully!");
    if (zoneInput) zoneInput.value = "";
    await loadZones();
  } catch (err) {
    console.error("Error adding zone:", err);
    alert("Error adding zone. See console for details.");
  }
}

// Load zones and render list + stats
async function loadZones() {
  try {
    await ensureDbReady();
    const snapshot = await getDocs(collection(window.db, "zones"));
    const list = document.getElementById("zoneList");
    if (list) list.innerHTML = "";

    let pending = 0, completed = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement('li');
     li.textContent = `${data.name}—${data.status || 'Unknown'}`;
      if (list) list.appendChild(li);

      if (data.status === "Pending") pending++;
      else if (data.status === "Completed") completed++;
    });

    const pendingEl = document.getElementById("pendingCount");
    const completedEl = document.getElementById("completedCount");
    if (pendingEl) pendingEl.textContent = pending;
    if (completedEl) completedEl.textContent = completed;
  } catch (err) {
    console.error("Error loading zones:", err);
  }
}

// Export a few functions to window so HTML onclick can call them
window.addZone = addZone;
window.loadZones = loadZones;

// Auto-run when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  // load zones if portal elements exist
  loadZones().catch(e => console.warn("Initial loadZones failed:", e));
});