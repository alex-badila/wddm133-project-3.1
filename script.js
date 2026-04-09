
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const dateInput = document.getElementById('date');
const addButton = document.getElementById('add-expense');
const budgetInput = document.getElementById('budget-input');
const setBudgetButton = document.getElementById('set-budget');
const totalSpentEl = document.getElementById('total-spent');
const budgetStatusEl = document.getElementById('budget-status');
const expensesList = document.getElementById('expenses');
const categoryChartCanvas = document.getElementById('category-chart');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let budget = parseFloat(localStorage.getItem('budget')) || 2000; // Default budget

function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function addExpense() {
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;
    const date = dateInput.value;

    if (!amount || !category || !date) {
        alert('Please fill in all fields');
        return;
    }

    const expense = {
        id: Date.now(),
        amount,
        category,
        date: new Date(date)
    };

    expenses.push(expense);
    saveExpenses();
    updateUI();

    amountInput.value = '';
    categorySelect.value = '';
    dateInput.value = '';
}

function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    saveExpenses();
    updateUI();
}

function setBudget() {
    const newBudget = parseFloat(budgetInput.value);
    if (newBudget > 0) {
        budget = newBudget;
        localStorage.setItem('budget', budget);
        budgetInput.value = '';
        updateUI();
    } else {
        alert('Please enter a valid budget amount');
    }
}

function getCurrentMonthExpenses() {
    const now = new Date();
    return expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    });
}

function calculateTotals() {
    const monthExpenses = getCurrentMonthExpenses();
    const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return { total, monthExpenses };
}

function getCategoryBreakdown() {
    const monthExpenses = getCurrentMonthExpenses();
    const categories = {};

    monthExpenses.forEach(exp => {
        categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
    });

    return categories;
}

function updateUI() {
    const { total, monthExpenses } = calculateTotals();
    totalSpentEl.textContent = `Total Spent: $${total.toFixed(2)} (Budget: $${budget.toFixed(2)})`;

    const budgetStatus = total > budget ? 'Over Budget' : total > budget * 0.8 ? 'Close to Budget' : 'On Track';
    budgetStatusEl.textContent = `Budget Status: ${budgetStatus}`;

    expensesList.innerHTML = '';
    monthExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10).forEach(exp => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${exp.category}: $${exp.amount.toFixed(2)} on ${new Date(exp.date).toLocaleDateString()}</span>
            <button onclick="deleteExpense(${exp.id})">Delete</button>
        `;
        expensesList.appendChild(li);
    });

    updateChart();
}

function updateChart() {
    const categories = getCategoryBreakdown();
    const labels = Object.keys(categories);
    const data = Object.values(categories);

    if (window.categoryChart) {
        window.categoryChart.destroy();
    }

    window.categoryChart = new Chart(categoryChartCanvas, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FF6384'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

dateInput.value = new Date().toISOString().split('T')[0];

addButton.addEventListener('click', addExpense);
setBudgetButton.addEventListener('click', setBudget);

updateUI();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

