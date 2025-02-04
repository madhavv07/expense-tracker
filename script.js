    // Variables to hold current user data and transactions
let currentUser = null;
let transactions = [];

// Elements
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const totalExpenses = document.getElementById('total-expenses');
const filterDateInput = document.getElementById('filter-date');
const filterButton = document.getElementById('filter-button');
const loading = document.getElementById('loading');

// Show password functionality
document.getElementById('show-signup-password').addEventListener('change', togglePasswordVisibility);
document.getElementById('show-login-password').addEventListener('change', togglePasswordVisibility);

// Handle Sign-Up
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (localStorage.getItem(username)) {
        document.getElementById('signup-message').textContent = 'Username already exists, please login!';
    } else {
        const user = { username, password, transactions: [] };
        localStorage.setItem(username, JSON.stringify(user));
        alert('Sign up successful! Please log in.');
        showLoginForm();
    }
});

// Handle Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = JSON.parse(localStorage.getItem(username));
    if (user && user.password === password) {
        currentUser = user;
        loadTransactions();
        showTransactionSection();
    } else {
        document.getElementById('login-message').textContent = 'Invalid username or password.';
    }
});

// Handle Transaction Form Submission
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];  // Use today's date if empty

    if (amount && !isNaN(amount) && description.trim() !== '') {
        const newTransaction = { amount, description, category, date };
        currentUser.transactions.push(newTransaction);
        localStorage.setItem(currentUser.username, JSON.stringify(currentUser));

        // Reset the form
        transactionForm.reset();
        loadTransactions();
    } else {
        alert('Please fill out all fields correctly.');
    }
});

// Show/Hide Password functionality
function togglePasswordVisibility() {
    const passwordFields = document.querySelectorAll('input[type="password"]');
    passwordFields.forEach(field => {
        field.type = field.type === 'password' ? 'text' : 'password';
    });
}

// Switch to the Login Form
document.getElementById('show-login').addEventListener('click', () => {
    showLoginForm();
});

// Switch to the Signup Form
document.getElementById('show-signup').addEventListener('click', () => {
    showSignupForm();
});

// Switch to the Transaction Section
function showTransactionSection() {
    document.getElementById('signup-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('transaction-section').style.display = 'block';
    document.getElementById('total-expenses-section').style.display = 'block';
    document.getElementById('filter-section').style.display = 'block';
    updateTotalExpenses();
}

// Show the Signup Form
function showSignupForm() {
    document.getElementById('signup-section').style.display = 'block';
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('transaction-section').style.display = 'none';
}

// Show the Login Form
function showLoginForm() {
    document.getElementById('signup-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('transaction-section').style.display = 'none';
    document.getElementById('total-expenses-section').style.display = 'none';
}

// Load Transactions from the currentUser
function loadTransactions() {
    transactionList.innerHTML = '';
    currentUser.transactions.forEach(transaction => {
        const transactionItem = document.createElement('li');
        transactionItem.innerHTML = `${transaction.description} - ₹${transaction.amount.toFixed(2)} - ${transaction.category} - ${transaction.date}`;
        transactionList.appendChild(transactionItem);
    });
    updateTotalExpenses();
}

// Update the Total Expenses
function updateTotalExpenses() {
    const total = currentUser.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    totalExpenses.textContent = total.toFixed(2);
}

// Filter Transactions by Date
filterButton.addEventListener('click', () => {
    const filterDate = filterDateInput.value;
    if (filterDate) {
        const filteredTransactions = currentUser.transactions.filter(transaction => transaction.date === filterDate);
        transactionList.innerHTML = '';
        filteredTransactions.forEach(transaction => {
            const transactionItem = document.createElement('li');
            transactionItem.innerHTML = `${transaction.description} - ₹${transaction.amount.toFixed(2)} - ${transaction.category} - ${transaction.date}`;
            transactionList.appendChild(transactionItem);
        });
    } else {
        loadTransactions();
    }
});
