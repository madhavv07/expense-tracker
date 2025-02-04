const transactionForm = document.getElementById('transaction-form');
const totalExpensesDisplay = document.getElementById('total-expenses');
let transactions = {};

// Handle signup submission
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const signupUsername = document.getElementById('signup-username').value;
    const signupPassword = document.getElementById('signup-password').value;

    // Validate password
    if (signupPassword.length !== 8 || !/^[A-Z]/.test(signupPassword)) {
        document.getElementById('signup-message').textContent = 'Password must be 8 characters long and start with a capital letter.';
        return;
    }

    // Check for existing username
    if (localStorage.getItem('username') === signupUsername) {
        document.getElementById('signup-message').textContent = 'Username already exists. Please choose a different one.';
        return;
    }

    // Store user credentials in local storage
    localStorage.setItem('username', signupUsername);
    localStorage.setItem('password', signupPassword);
    document.getElementById('signup-message').textContent = 'Signup successful! You can now log in.';
    document.getElementById('signup-form').reset();
});

// Handle login submission
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check credentials
    if (username === localStorage.getItem('username') && password === localStorage.getItem('password')) {
        document.getElementById('login-message').textContent = 'Login successful!';
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('transaction-section').style.display = 'block';
        document.getElementById('total-expenses-section').style.display = 'block';
        document.getElementById('filter-section').style.display = 'block';
    } else {
        document.getElementById('login-message').textContent = 'Invalid credentials. Please try again.';
    }
});

// Show password functionality
document.getElementById('show-signup-password').addEventListener('change', function() {
    const passwordField = document.getElementById('signup-password');
    passwordField.type = this.checked ? 'text' : 'password';
});

document.getElementById('show-login-password').addEventListener('change', function() {
    const passwordField = document.getElementById('password');
    passwordField.type = this.checked ? 'text' : 'password';
});

// Switch to login form
document.getElementById('show-login').addEventListener('click', function() {
    document.getElementById('signup-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
});

// Switch to signup form
document.getElementById('show-signup').addEventListener('click', function() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('signup-section').style.display = 'block';
});

document.getElementById('category').addEventListener('change', function() {
    if (this.value === 'Online') {
        window.location.href = 'online-transactions.html';
    }
});

// Handle transaction submission
transactionForm.addEventListener('submit', function(event) {

    event.preventDefault();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value || "Uncategorized";
    const dateInput = document.getElementById('date').value;
    const date = dateInput ? dateInput : new Date().toISOString().split('T')[0];

    if (amount <= 0) {
        alert('Amount must be a positive number.');
        return;
    }

    const transaction = {
        amount: amount,
        description: description,
        date: date
    };

    if (!transactions[category]) {
        transactions[category] = {};
    }
    if (!transactions[category][date]) {
        transactions[category][date] = [];
    }
    transactions[category][date].push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    displayTransactions();
    calculateTotalExpenses();
    transactionForm.reset();
});

// Load transactions from local storage on page load
window.onload = function() {
    const savedTransactions = JSON.parse(localStorage.getItem('transactions'));
    if (savedTransactions) {
        transactions = savedTransactions;
        displayTransactions();
    }
};

function displayTransactions() {
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';

    for (const category in transactions) {
        const categoryHeader = document.createElement('h3');
        categoryHeader.textContent = category;
        transactionList.appendChild(categoryHeader);

        for (const date in transactions[category]) {
            const dateHeader = document.createElement('h4');
            dateHeader.textContent = date;
            transactionList.appendChild(dateHeader);

            let dateTotal = 0;
            transactions[category][date].forEach((transaction, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'transaction-item';
                listItem.textContent = `${transaction.date}: ${transaction.description} - ₹${transaction.amount.toFixed(2)}`;
                
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.addEventListener('click', function() {
                    transactions[category][date].splice(index, 1);
                    if (transactions[category][date].length === 0) {
                        delete transactions[category][date];
                    }
                    if (Object.keys(transactions[category]).length === 0) {
                        delete transactions[category];
                    }
                    localStorage.setItem('transactions', JSON.stringify(transactions));
                    displayTransactions();
                    calculateTotalExpenses();
                });
                
                listItem.appendChild(removeButton);
                transactionList.appendChild(listItem);

                dateTotal += transaction.amount;
            });

            const dateTotalDisplay = document.createElement('p');
            dateTotalDisplay.textContent = `Total for ${date}: ₹${dateTotal.toFixed(2)}`;
            transactionList.appendChild(dateTotalDisplay);
        }
    }

    calculateTotalExpenses();
}

function calculateTotalExpenses() {
    const total = Object.values(transactions).flatMap(category => 
        Object.values(category).flat()
    ).reduce((sum, transaction) => sum + transaction.amount, 0);
    totalExpensesDisplay.textContent = total.toFixed(2);
}

// Filter transactions by date only
document.getElementById('filter-button').addEventListener('click', function() {
    const filterDate = document.getElementById('filter-date').value;
    const filteredTransactions = {};
    
    for (const category in transactions) {
        filteredTransactions[category] = {};
        for (const date in transactions[category]) {
            if (date === filterDate) {
                filteredTransactions[category][date] = transactions[category][date];
            }
        }
    }
    displayFilteredTransactions(filteredTransactions);
});

function displayFilteredTransactions(filteredTransactions) {
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';

    for (const category in filteredTransactions) {
        const categoryHeader = document.createElement('h3');
        categoryHeader.textContent = category;
        transactionList.appendChild(categoryHeader);

        for (const date in filteredTransactions[category]) {
            const dateHeader = document.createElement('h4');
            dateHeader.textContent = date;
            transactionList.appendChild(dateHeader);

            let dateTotal = 0;
            filteredTransactions[category][date].forEach((transaction, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'transaction-item';
                listItem.textContent = `${transaction.date}: ${transaction.description} - ₹${transaction.amount.toFixed(2)}`;
                
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.addEventListener('click', function() {
                    filteredTransactions[category][date].splice(index, 1);
                    if (filteredTransactions[category][date].length === 0) {
                        delete filteredTransactions[category][date];
                    }
                    if (Object.keys(filteredTransactions[category]).length === 0) {
                        delete filteredTransactions[category];
                    }
                    displayFilteredTransactions(filteredTransactions);
                });
                
                listItem.appendChild(removeButton);
                transactionList.appendChild(listItem);

                dateTotal += transaction.amount;
            });

            const dateTotalDisplay = document.createElement('p');
            dateTotalDisplay.textContent = `Total for ${date}: ₹${dateTotal.toFixed(2)}`;
            transactionList.appendChild(dateTotalDisplay);
        }
    }
}
