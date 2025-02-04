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
    const password =
