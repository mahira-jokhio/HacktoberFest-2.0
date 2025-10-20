// =============================================
// SMART CITY WASTE MANAGEMENT - MAIN.JS
// =============================================

// Global variables
let currentUser = null;
let users = JSON.parse(localStorage.getItem('smartcity_users')) || [];
let complaints = JSON.parse(localStorage.getItem('smartcity_complaints')) || [];
let routes = JSON.parse(localStorage.getItem('smartcity_routes')) || [];
let zones = JSON.parse(localStorage.getItem('smartcity_zones')) || [];
let vehicles = JSON.parse(localStorage.getItem('smartcity_vehicles')) || [];
let staff = JSON.parse(localStorage.getItem('smartcity_staff')) || [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('SmartCity JS initialized');
    initializeApp();
});

function initializeApp() {
    // Initialize default data
    initializeDefaultData();
    
    // Set active sidebar
    setActiveSidebar();
    
    // Setup page-specific functionality
    setupPageFunctionality();
    
    // Setup logout links
    setupLogoutLinks();
    
    // Add alert styles
    addAlertStyles();
    
    console.log('Current zones:', zones);
    console.log('Current routes:', routes);
}

function initializeDefaultData() {
    if (users.length === 0) {
        users = [
            { id: 1, name: 'Admin User', email: 'admin@smartcity.com', password: 'admin123', role: 'admin' },
            { id: 2, name: 'Ali Khan', email: 'driver@smartcity.com', password: 'driver123', role: 'driver', phone: '0300-1234567', status: 'Active' },
            { id: 3, name: 'Ahmed Raza', email: 'citizen@smartcity.com', password: 'citizen123', role: 'citizen' }
        ];
        localStorage.setItem('smartcity_users', JSON.stringify(users));
        console.log('Default users created');
    }

    if (zones.length === 0) {
        zones = [
            { id: 'Z001', name: 'North Block', driver: 'Ali Khan', status: 'Active' },
            { id: 'Z002', name: 'South Block', driver: 'Ali Khan', status: 'Active' },
            { id: 'Z003', name: 'East Block', driver: 'Ali Khan', status: 'Active' }
        ];
        localStorage.setItem('smartcity_zones', JSON.stringify(zones));
        console.log('Default zones created');
    }

    if (routes.length === 0) {
        routes = [
            { id: 'R-201', zone: 'North Block', driver: 'Ali Khan', status: 'Completed', startTime: '08:00 AM', date: getTodayDate() },
            { id: 'R-205', zone: 'South Block', driver: 'Ali Khan', status: 'Pending', startTime: '09:00 AM', date: getTodayDate() },
            { id: 'R-208', zone: 'East Block', driver: 'Ali Khan', status: 'Pending', startTime: '10:00 AM', date: getTodayDate() }
        ];
        localStorage.setItem('smartcity_routes', JSON.stringify(routes));
        console.log('Default routes created');
    }

    if (complaints.length === 0) {
        complaints = [
            { id: 'C-1021', location: 'Sector 5', description: 'Garbage not collected for 3 days', status: 'Resolved', reportedDate: '2025-10-17', expectedResolution: '2025-10-18', citizen: 'Ahmed Raza' },
            { id: 'C-1025', location: 'Sector 8', description: 'Overflowing bins near park', status: 'Pending', reportedDate: '2025-10-19', expectedResolution: '2025-10-21', citizen: 'Ahmed Raza' }
        ];
        localStorage.setItem('smartcity_complaints', JSON.stringify(complaints));
    }

    if (vehicles.length === 0) {
        vehicles = [
            { id: 'V001', plateNumber: 'ABC-123', status: 'Available', zone: 'North Block' }
        ];
        localStorage.setItem('smartcity_vehicles', JSON.stringify(vehicles));
    }

    if (staff.length === 0) {
        staff = [
            { id: 'D001', name: 'Ali Khan', phone: '0300-1234567', status: 'Active' }
        ];
        localStorage.setItem('smartcity_staff', JSON.stringify(staff));
    }
}

// Utility Functions
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

function showAlert(message, type = 'success') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `custom-alert ${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button class="alert-close">&times;</button>
    `;

    // Add to page
    document.body.appendChild(alert);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);

    // Close button functionality
    alert.querySelector('.alert-close').addEventListener('click', () => {
        alert.remove();
    });
}

function setActiveSidebar() {
    const currentPage = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('.sidebar a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

function setupLogoutLinks() {
    document.querySelectorAll('a[href*="index.html"]').forEach(link => {
        if (link.textContent.toLowerCase().includes('logout')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                logoutUser();
            });
        }
    });
}

function addAlertStyles() {
    if (!document.querySelector('#alert-styles')) {
        const style = document.createElement('style');
        style.id = 'alert-styles';
        style.textContent = `
            .custom-alert {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                z-index: 10000;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                min-width: 300px;
                max-width: 500px;
                font-family: Arial, sans-serif;
            }
            .custom-alert.success {
                background-color: #4caf50;
            }
            .custom-alert.error {
                background-color: #f44336;
            }
            .alert-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                margin-left: 10px;
            }
        `;
        document.head.appendChild(style);
    }
}

// Authentication Functions
function loginUser(email, password, role) {
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('smartcity_currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('smartcity_currentUser');
    window.location.href = '../index.html';
}

function registerUser(name, email, password, role) {
    if (users.find(u => u.email === email)) {
        return false;
    }
    
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        role
    };
    
    users.push(newUser);
    localStorage.setItem('smartcity_users', JSON.stringify(users));
    return true;
}

function getCurrentUser() {
    if (!currentUser) {
        const storedUser = localStorage.getItem('smartcity_currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
        }
    }
    return currentUser;
}

// Data Management Functions
function refreshData() {
    // Reload data from localStorage to ensure we have latest
    users = JSON.parse(localStorage.getItem('smartcity_users')) || [];
    complaints = JSON.parse(localStorage.getItem('smartcity_complaints')) || [];
    routes = JSON.parse(localStorage.getItem('smartcity_routes')) || [];
    zones = JSON.parse(localStorage.getItem('smartcity_zones')) || [];
    vehicles = JSON.parse(localStorage.getItem('smartcity_vehicles')) || [];
    staff = JSON.parse(localStorage.getItem('smartcity_staff')) || [];
}

function getRoutesForDriver(driverName) {
    refreshData();
    return routes.filter(route => route.driver === driverName && route.date === getTodayDate());
}

function getZonesForDriver(driverName) {
    refreshData();
    return zones.filter(zone => zone.driver === driverName);
}

function getComplaintsForCitizen(citizenName) {
    refreshData();
    return complaints.filter(complaint => complaint.citizen === citizenName);
}

function addZone(name, driver) {
    refreshData();
    const newZone = {
        id: 'Z' + (zones.length + 1).toString().padStart(3, '0'),
        name,
        driver,
        status: 'Active'
    };
    
    zones.push(newZone);
    localStorage.setItem('smartcity_zones', JSON.stringify(zones));
    
    // Also create a route for this zone
    const newRoute = {
        id: 'R-' + (200 + routes.length + 1),
        zone: name,
        driver: driver,
        status: 'Pending',
        startTime: '08:00 AM',
        date: getTodayDate()
    };
    
    routes.push(newRoute);
    localStorage.setItem('smartcity_routes', JSON.stringify(routes));
    
    return true;
}

function addStaff(name, phone) {
    refreshData();
    const newStaff = {
        id: 'D' + (staff.length + 1).toString().padStart(3, '0'),
        name,
        phone,
        status: 'Active'
    };
    
    staff.push(newStaff);
    localStorage.setItem('smartcity_staff', JSON.stringify(staff));
    
    // Also add as a driver user if not exists
    const driverEmail = `${name.replace(/\s+/g, '').toLowerCase()}@smartcity.com`;
    if (!users.find(u => u.email === driverEmail)) {
        users.push({
            id: users.length + 1,
            name,
            email: driverEmail,
            password: 'driver123',
            role: 'driver',
            phone,
            status: 'Active'
        });
        localStorage.setItem('smartcity_users', JSON.stringify(users));
    }
    
    return true;
}

function updateRouteStatus(routeId, status) {
    refreshData();
    const routeIndex = routes.findIndex(route => route.id === routeId);
    if (routeIndex !== -1) {
        routes[routeIndex].status = status;
        localStorage.setItem('smartcity_routes', JSON.stringify(routes));
        return true;
    }
    return false;
}

// Page Setup Function
function setupPageFunctionality() {
    const path = window.location.pathname;
    const page = path.split('/').pop();

    console.log('Setting up page:', page);

    switch(page) {
        case 'login.html':
            setupLoginPage();
            break;
        case 'signup.html':
            setupSignupPage();
            break;
        case 'dashboard.html':
            setupDashboardPage();
            break;
        case 'assigned-routes.html':
            setupAssignedRoutesPage();
            break;
        case 'update-status.html':
            setupUpdateStatusPage();
            break;
        case 'report.html':
        case 'report-complaint.html':
            setupReportComplaintPage();
            break;
        case 'manage-zones.html':
            setupManageZonesPage();
            break;
        case 'manage-staff.html':
            setupManageStaffPage();
            break;
        case 'manage-vehicles.html':
            setupManageVehiclesPage();
            break;
        case 'view-status.html':
            setupViewStatusPage();
            break;
        case 'reports.html':
            setupReportsPage();
            break;
        default:
            console.log('Page setup not defined for:', page);
    }
}

// Login Page Setup
function setupLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.querySelector('.email').value;
            const password = document.querySelector('.password').value;
            const role = document.querySelector('.role').value;
            
            if (!email || !password || !role) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            if (loginUser(email, password, role)) {
                showAlert('Login successful! Redirecting...');
                setTimeout(() => {
                    // Redirect based on role
                    if (role === 'admin') window.location.href = 'admin/dashboard.html';
                    else if (role === 'driver') window.location.href = 'driver/dashboard.html';
                    else if (role === 'citizen') window.location.href = 'citizen/dashboard.html';
                }, 1000);
            } else {
                showAlert('Invalid credentials. Please try again.', 'error');
            }
        });
    }
}

// Signup Page Setup
function setupSignupPage() {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.querySelector('.name').value;
            const email = document.querySelector('.email').value;
            const password = document.querySelector('.password').value;
            const role = document.querySelector('.role').value;
            
            if (!name || !email || !password || !role) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            if (registerUser(name, email, password, role)) {
                showAlert('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                showAlert('Email already exists. Please use a different email.', 'error');
            }
        });
    }
}

// Dashboard Page Setup
function setupDashboardPage() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '../login.html';
        return;
    }
    
    console.log('Setting up dashboard for:', user.name, user.role);
    
    // Update welcome message
    const welcomeHeading = document.querySelector('main h1');
    if (welcomeHeading) {
        if (user.role === 'citizen') {
            welcomeHeading.textContent = `Welcome, Citizen 👋`;
        } else if (user.role === 'driver') {
            welcomeHeading.textContent = `Welcome, Driver 🚛`;
        } else {
            welcomeHeading.textContent = `Welcome, Admin!`;
        }
    }
    
    // Update dashboard stats
    updateDashboardStats(user);
    
    // Load appropriate data table
    loadDashboardTable(user);
}

function updateDashboardStats(user) {
    const cards = document.querySelectorAll('.card p');
    if (cards.length === 0) return;
    
    refreshData();
    
    if (user.role === 'driver') {
        const driverRoutes = routes.filter(route => route.driver === user.name && route.date === getTodayDate());
        const completed = driverRoutes.filter(route => route.status === 'Completed').length;
        const pending = driverRoutes.filter(route => route.status === 'Pending').length;
        
        if (cards[0]) cards[0].textContent = driverRoutes.length;
        if (cards[1]) cards[1].textContent = completed;
        if (cards[2]) cards[2].textContent = pending;
    } else if (user.role === 'citizen') {
        const citizenComplaints = complaints.filter(complaint => complaint.citizen === user.name);
        const resolved = citizenComplaints.filter(complaint => complaint.status === 'Resolved').length;
        const pending = citizenComplaints.filter(complaint => complaint.status === 'Pending').length;
        
        if (cards[0]) cards[0].textContent = citizenComplaints.length;
        if (cards[1]) cards[1].textContent = resolved;
        if (cards[2]) cards[2].textContent = pending;
    } else if (user.role === 'admin') {
        if (cards[0]) cards[0].textContent = zones.length;
        if (cards[1]) cards[1].textContent = vehicles.length;
        if (cards[2]) cards[2].textContent = routes.filter(route => route.status === 'Pending').length;
    }
}

function loadDashboardTable(user) {
    const tableBody = document.querySelector('.table-section tbody');
    if (!tableBody) return;
    
    refreshData();
    tableBody.innerHTML = '';
    
    if (user.role === 'driver') {
        const driverRoutes = routes.filter(route => route.driver === user.name && route.date === getTodayDate());
        console.log('Driver routes:', driverRoutes);
        
        driverRoutes.forEach(route => {
            const statusColor = route.status === 'Completed' ? 'green' : 'orange';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${route.id}</td>
                <td>${route.zone}</td>
                <td><span style="color:${statusColor};">${route.status}</span></td>
                <td>${route.startTime}</td>
                <td><a href="update-status.html?route=${route.id}" class="btn btn-sm">Update</a></td>
            `;
            tableBody.appendChild(row);
        });
    } else if (user.role === 'citizen') {
        const citizenComplaints = complaints.filter(complaint => complaint.citizen === user.name);
        citizenComplaints.forEach(complaint => {
            const statusColor = complaint.status === 'Resolved' ? 'green' : 'orange';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${complaint.id}</td>
                <td>${complaint.location}</td>
                <td><span style="color:${statusColor};">${complaint.status}</span></td>
                <td>${complaint.reportedDate}</td>
                <td>${complaint.expectedResolution || 'Not set'}</td>
            `;
            tableBody.appendChild(row);
        });
    } else if (user.role === 'admin') {
        const recentRoutes = routes.slice(-5); // Show last 5 routes
        recentRoutes.forEach(route => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${route.zone}</td>
                <td>${route.driver}</td>
                <td>${route.status}</td>
                <td>${route.date} ${route.startTime}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Assigned Routes Page
function setupAssignedRoutesPage() {
    const user = getCurrentUser();
    if (!user || user.role !== 'driver') {
        window.location.href = '../login.html';
        return;
    }
    
    const tableBody = document.querySelector('.table-section tbody');
    if (tableBody) {
        refreshData();
        const driverRoutes = routes.filter(route => route.driver === user.name && route.date === getTodayDate());
        tableBody.innerHTML = '';
        
        driverRoutes.forEach(route => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${route.id}</td>
                <td>${route.zone}</td>
                <td>${route.startTime}</td>
                <td>${route.status}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Update Status Page
function setupUpdateStatusPage() {
    const user = getCurrentUser();
    if (!user || user.role !== 'driver') {
        window.location.href = '../login.html';
        return;
    }
    
    // Get route ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const routeId = urlParams.get('route');
    
    const form = document.querySelector('form');
    if (form) {
        // Populate zones dropdown with driver's zones
        const zoneSelect = form.querySelector('select');
        if (zoneSelect) {
            refreshData();
            const driverZones = zones.filter(zone => zone.driver === user.name);
            zoneSelect.innerHTML = '<option value="">Choose Zone</option>';
            driverZones.forEach(zone => {
                const option = document.createElement('option');
                option.value = zone.name;
                option.textContent = zone.name;
                zoneSelect.appendChild(option);
            });
            
            // Pre-select zone if route ID is provided
            if (routeId) {
                const route = routes.find(r => r.id === routeId);
                if (route) {
                    zoneSelect.value = route.zone;
                    zoneSelect.disabled = true; // Disable if route is specified
                }
            }
        }
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const zone = form.querySelector('select').value;
            const status = form.querySelectorAll('select')[1].value;
            
            if (!zone || !status) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            refreshData();
            
            // Find and update route
            let routeToUpdate;
            if (routeId) {
                routeToUpdate = routes.find(r => r.id === routeId);
            } else {
                routeToUpdate = routes.find(r => r.zone === zone && r.driver === user.name && r.date === getTodayDate());
            }
            
            if (routeToUpdate) {
                routeToUpdate.status = status.charAt(0).toUpperCase() + status.slice(1);
                localStorage.setItem('smartcity_routes', JSON.stringify(routes));
                showAlert('Status updated successfully!');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showAlert('Route not found for this zone', 'error');
            }
        });
    }
}

// Report Complaint Page
function setupReportComplaintPage() {
    const user = getCurrentUser();
    if (!user || user.role !== 'citizen') {
        window.location.href = '../login.html';
        return;
    }
    
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const location = form.querySelector('input[type="text"]').value;
            const description = form.querySelector('textarea').value;
            
            if (!location || !description) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            refreshData();
            
            // Add complaint
            const newComplaint = {
                id: 'C-' + (complaints.length + 1000),
                location,
                description,
                status: 'Pending',
                reportedDate: getTodayDate(),
                expectedResolution: '',
                citizen: user.name
            };
            
            complaints.push(newComplaint);
            localStorage.setItem('smartcity_complaints', JSON.stringify(complaints));
            
            showAlert('Complaint submitted successfully!');
            form.reset();
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }
}

// Manage Zones Page (Admin)
function setupManageZonesPage() {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = '../login.html';
        return;
    }
    
    // Load zones table
    const tableBody = document.querySelector('.table-section tbody');
    if (tableBody) {
        refreshData();
        tableBody.innerHTML = '';
        
        zones.forEach(zone => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${zone.id}</td>
                <td>${zone.name}</td>
                <td>${zone.driver}</td>
                <td>${zone.status}</td>
                <td>
                    <button class="btn-sm edit" data-id="${zone.id}">Edit</button>
                    <button class="btn-sm danger" data-id="${zone.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.btn-sm.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const zoneId = e.target.getAttribute('data-id');
                showAlert(`Edit functionality for zone ${zoneId} would open here`);
            });
        });
        
        document.querySelectorAll('.btn-sm.danger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const zoneId = e.target.getAttribute('data-id');
                if (confirm(`Are you sure you want to delete zone ${zoneId}?`)) {
                    refreshData();
                    const zoneIndex = zones.findIndex(z => z.id === zoneId);
                    if (zoneIndex !== -1) {
                        // Also remove routes for this zone
                        routes = routes.filter(r => r.zone !== zones[zoneIndex].name);
                        zones.splice(zoneIndex, 1);
                        localStorage.setItem('smartcity_zones', JSON.stringify(zones));
                        localStorage.setItem('smartcity_routes', JSON.stringify(routes));
                        showAlert('Zone deleted successfully');
                        // Refresh the table
                        setupManageZonesPage();
                    }
                }
            });
        });
    }
    
    // Add new zone form
    const form = document.querySelector('.form-section form');
    if (form) {
        // Populate drivers dropdown
        const driverSelect = form.querySelector('select');
        if (driverSelect) {
            refreshData();
            driverSelect.innerHTML = '<option value="">Select Driver</option>';
            staff.forEach(driver => {
                const option = document.createElement('option');
                option.value = driver.name;
                option.textContent = driver.name;
                driverSelect.appendChild(option);
            });
        }
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const zoneName = form.querySelector('input[type="text"]').value;
            const driver = form.querySelector('select').value;
            
            if (!zoneName || !driver) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            if (addZone(zoneName, driver)) {
                showAlert('Zone added successfully!');
                form.reset();
                // Refresh the table
                setupManageZonesPage();
            } else {
                showAlert('Error adding zone', 'error');
            }
        });
    }
}

// Manage Staff Page (Admin)
function setupManageStaffPage() {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = '../login.html';
        return;
    }
    
    // Load staff table
    const tableBody = document.querySelector('.table-section tbody');
    if (tableBody) {
        refreshData();
        tableBody.innerHTML = '';
        
        staff.forEach(driver => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${driver.id}</td>
                <td>${driver.name}</td>
                <td>${driver.phone}</td>
                <td>${driver.status}</td>
                <td>
                    <button class="btn-sm edit" data-id="${driver.id}">Edit</button>
                    <button class="btn-sm danger" data-id="${driver.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.btn-sm.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const driverId = e.target.getAttribute('data-id');
                showAlert(`Edit functionality for driver ${driverId} would open here`);
            });
        });
        
        document.querySelectorAll('.btn-sm.danger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const driverId = e.target.getAttribute('data-id');
                if (confirm(`Are you sure you want to delete driver ${driverId}?`)) {
                    refreshData();
                    const driverIndex = staff.findIndex(d => d.id === driverId);
                    if (driverIndex !== -1) {
                        staff.splice(driverIndex, 1);
                        localStorage.setItem('smartcity_staff', JSON.stringify(staff));
                        showAlert('Driver deleted successfully');
                        setupManageStaffPage();
                    }
                }
            });
        });
    }
    
    // Add new staff form
    const form = document.querySelector('.form-section form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = form.querySelector('input[type="text"]').value;
            const phone = form.querySelectorAll('input[type="text"]')[1].value;
            
            if (!name || !phone) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            if (addStaff(name, phone)) {
                showAlert('Driver added successfully!');
                form.reset();
                setupManageStaffPage();
            } else {
                showAlert('Error adding driver', 'error');
            }
        });
    }
}

// Manage Vehicles Page (Admin)
function setupManageVehiclesPage() {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = '../login.html';
        return;
    }
    
    // Load vehicles table
    const tableBody = document.querySelector('.table-section tbody');
    if (tableBody) {
        refreshData();
        tableBody.innerHTML = '';
        
        vehicles.forEach(vehicle => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vehicle.id}</td>
                <td>${vehicle.plateNumber}</td>
                <td>${vehicle.status}</td>
                <td>${vehicle.zone}</td>
                <td>
                    <button class="btn-sm edit" data-id="${vehicle.id}">Edit</button>
                    <button class="btn-sm danger" data-id="${vehicle.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    // Add new vehicle form
    const form = document.querySelector('.form-section form');
    if (form) {
        // Populate zones dropdown
        const zoneSelect = form.querySelector('select');
        if (zoneSelect) {
            refreshData();
            zoneSelect.innerHTML = '<option value="">Select Zone</option>';
            zones.forEach(zone => {
                const option = document.createElement('option');
                option.value = zone.name;
                option.textContent = zone.name;
                zoneSelect.appendChild(option);
            });
        }
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const plateNumber = form.querySelector('input[type="text"]').value;
            const zone = form.querySelector('select').value;
            
            if (!plateNumber || !zone) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            refreshData();
            const newVehicle = {
                id: 'V' + (vehicles.length + 1).toString().padStart(3, '0'),
                plateNumber,
                status: 'Available',
                zone
            };
            
            vehicles.push(newVehicle);
            localStorage.setItem('smartcity_vehicles', JSON.stringify(vehicles));
            
            showAlert('Vehicle added successfully!');
            form.reset();
            setupManageVehiclesPage();
        });
    }
}

// View Status Page (Citizen)
function setupViewStatusPage() {
    const user = getCurrentUser();
    if (!user || user.role !== 'citizen') {
        window.location.href = '../login.html';
        return;
    }
    
    const tableBody = document.querySelector('.table-section tbody');
    if (tableBody) {
        refreshData();
        const citizenComplaints = complaints.filter(complaint => complaint.citizen === user.name);
        tableBody.innerHTML = '';
        
        citizenComplaints.forEach(complaint => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${complaint.id}</td>
                <td>${complaint.location}</td>
                <td>${complaint.status}</td>
                <td>${complaint.expectedResolution || 'Not set'}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Reports Page (Admin)
function setupReportsPage() {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = '../login.html';
        return;
    }
    
    // Update stats cards
    const statCards = document.querySelectorAll('.card p');
    if (statCards.length >= 3) {
        refreshData();
        const today = getTodayDate();
        statCards[0].textContent = routes.filter(r => r.date === today).length;
        statCards[1].textContent = complaints.filter(c => c.status === 'Pending').length;
        statCards[2].textContent = complaints.filter(c => c.status === 'Resolved').length;
    }
    
    // Load complaints table
    const tableBody = document.querySelector('.table-section tbody');
    if (tableBody) {
        refreshData();
        tableBody.innerHTML = '';
        
        const recentComplaints = complaints.slice(0, 10); // Show last 10 complaints
        recentComplaints.forEach(complaint => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${complaint.id}</td>
                <td>${complaint.citizen}</td>
                <td>${complaint.location}</td>
                <td>${complaint.status}</td>
                <td>${complaint.expectedResolution || 'Not set'}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}