// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load orders from server
    loadOrders();
    
    // Set up form submission
    document.getElementById('order-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addOrder();
    });
    
    // Set up month selector
    setupMonthSelector();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('order-date').value = today;
});

// Add a new order
function addOrder() {
    const dateInput = document.getElementById('order-date');
    const amountInput = document.getElementById('order-amount');
    const descriptionInput = document.getElementById('order-description');
    
    const order = {
        date: dateInput.value,
        amount: parseFloat(amountInput.value),
        description: descriptionInput.value || 'No description'
    };
    
    fetch('/api/expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => {
        // Reset form
        amountInput.value = '';
        descriptionInput.value = '';
        amountInput.focus();
        
        // Reload orders and summary
        loadOrders();
        updateSummary();
    })
    .catch(error => {
        console.error('Error adding order:', error);
        alert('Error adding order. Please try again.');
    });
}

// Delete an order
function deleteOrder(id) {
    fetch(`/api/expenses/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        // Reload orders and summary
        loadOrders();
        updateSummary();
    })
    .catch(error => {
        console.error('Error deleting order:', error);
        alert('Error deleting order. Please try again.');
    });
}

// Load orders from server
function loadOrders() {
    fetch('/api/expenses')
    .then(response => response.json())
    .then(orders => {
        renderOrders(orders);
        updateSummary();
    })
    .catch(error => {
        console.error('Error loading orders:', error);
        alert('Error loading orders. Please try again.');
    });
}

// Render orders in the UI
function renderOrders(orders) {
    const ordersList = document.getElementById('orders-list');
    const noOrdersMessage = document.getElementById('no-orders-message');
    
    if (orders.length === 0) {
        noOrdersMessage.style.display = 'block';
        ordersList.innerHTML = '';
        return;
    }
    
    noOrdersMessage.style.display = 'none';
    
    ordersList.innerHTML = '';
    orders.forEach(order => {
        const orderElement = document.createElement('li');
        orderElement.className = 'order-item';
        orderElement.innerHTML = `
            <div class="order-details">
                <div class="order-date">${formatDate(order.date)}</div>
                <div class="order-description">${order.description}</div>
            </div>
            <div class="order-amount">${order.amount.toLocaleString()} Ft</div>
            <button class="delete-btn" onclick="deleteOrder(${order.id})">Delete</button>
        `;
        ordersList.appendChild(orderElement);
    });
}

// Set up month selector
function setupMonthSelector() {
    fetch('/api/months')
    .then(response => response.json())
    .then(months => {
        const monthSelector = document.getElementById('month-selector');
        
        // Add options to selector
        monthSelector.innerHTML = '<option value="">All Time</option>';
        months.forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = formatDateMonth(month);
            monthSelector.appendChild(option);
        });
        
        // Add event listener for when selection changes
        monthSelector.addEventListener('change', updateSummary);
    })
    .catch(error => {
        console.error('Error loading months:', error);
    });
}

// Update the summary section
function updateSummary() {
    const monthSelector = document.getElementById('month-selector');
    const selectedMonth = monthSelector.value;
    
    // Build query string
    const query = selectedMonth ? `?month=${selectedMonth}` : '';
    
    fetch(`/api/summary${query}`)
    .then(response => response.json())
    .then(summary => {
        // Update UI
        document.getElementById('order-count').textContent = summary.orderCount || 0;
        document.getElementById('total-amount').textContent = `${(summary.totalAmount || 0).toLocaleString()} Ft`;
        document.getElementById('average-amount').textContent = `${(summary.averageAmount || 0).toLocaleString(undefined, {maximumFractionDigits: 0})} Ft`;
    })
    .catch(error => {
        console.error('Error loading summary:', error);
        alert('Error loading summary. Please try again.');
    });
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('hu-HU', options);
}

// Format month for selector
function formatDateMonth(monthString) {
    const date = new Date(monthString + '-01');
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('hu-HU', options);
}