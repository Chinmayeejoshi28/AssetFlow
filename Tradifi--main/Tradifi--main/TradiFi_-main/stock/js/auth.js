// DOM Elements
const authModal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const closeBtn = document.querySelector('.close');
const authTabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const usernameDisplay = document.getElementById('username');
const profileAvatar = document.getElementById('headerProfileAvatar');
const profileDropdown = document.querySelector('.profile-dropdown');

// Event Listeners
loginBtn.addEventListener('click', () => {
    authModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    authModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.style.display = 'none';
    }
});

// Tab switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        authTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Show corresponding form
        if (tab.dataset.tab === 'login') {
            loginForm.style.display = 'flex';
            signupForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'flex';
        }
    });
});

// Check if user is already logged in
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        updateUIForLoggedInUser(user);
    }
}

// Update UI elements when user logs in
function updateUIForLoggedInUser(user) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'flex';
    
    // Update profile display
    usernameDisplay.textContent = user.name;
    
    // Update avatar with user initials
    const initials = user.name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    
    // Update avatar with custom HTML
    profileAvatar.innerHTML = `
        <span class="user-initials">${initials}</span>
        <div class="status-indicator"></div>
    `;

    // Add user role badge
    const userRole = document.createElement('div');
    userRole.className = 'user-role';
    userRole.textContent = user.role || 'Trader';
    profileDropdown.appendChild(userRole);

    // Store additional user info in localStorage
    const userInfo = {
        ...user,
        lastLogin: new Date().toISOString(),
        loginCount: (parseInt(user.loginCount) || 0) + 1
    };
    localStorage.setItem('user', JSON.stringify(userInfo));
}

// Handle Login
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // In a real app, you would validate against a backend
    // For demo, we'll create a mock user
    const user = {
        name: email.split('@')[0].replace(/[^a-zA-Z ]/g, ' '),
        email: email,
        role: 'Active Trader',
        joinDate: new Date().toISOString(),
        tradingPreferences: {
            defaultInvestment: 1000,
            riskLevel: 'Moderate'
        },
        accountDetails: {
            accountType: 'Standard',
            verificationStatus: 'Verified'
        }
    };

    // Store user data
    localStorage.setItem('user', JSON.stringify(user));
    
    // Update UI
    updateUIForLoggedInUser(user);
    
    // Close modal
    authModal.style.display = 'none';
});

// Handle Signup
signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    // Create new user object
    const user = {
        name: name,
        email: email,
        role: 'New Trader',
        joinDate: new Date().toISOString(),
        tradingPreferences: {
            defaultInvestment: 1000,
            riskLevel: 'Moderate'
        },
        accountDetails: {
            accountType: 'Standard',
            verificationStatus: 'Pending'
        }
    };

    // Store user data
    localStorage.setItem('user', JSON.stringify(user));
    
    // Update UI
    updateUIForLoggedInUser(user);
    
    // Close modal
    authModal.style.display = 'none';
});

// Handle Logout
logoutBtn.addEventListener('click', function() {
    // Clear user data
    localStorage.removeItem('user');
    
    // Reset UI
    loginBtn.style.display = 'flex';
    logoutBtn.style.display = 'none';
    usernameDisplay.textContent = 'Guest User';
    profileAvatar.innerHTML = '<i class="fas fa-user-tie"></i><div class="status-indicator"></div>';
    
    // Remove role badge if exists
    const userRole = document.querySelector('.user-role');
    if (userRole) {
        userRole.remove();
    }
});

// Check login status on page load
checkLoginStatus(); 