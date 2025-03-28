// Fetch all payments from API
function fetchPayments() {
  fetch('/api/v1/payments', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('Payments:', data);
    renderPayments(data);
  })
  .catch(error => {
    console.error('Error fetching payments:', error);
  });
}

// Render payments in the table
function renderPayments(payments) {
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  payments.forEach(payment => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <i class="fas fa-user text-blue-600"></i>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900">${payment.tenant.name}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">${payment.room.roomNumber}</td>
      <td class="px-6 py-4 whitespace-nowrap">$${payment.amount.toFixed(2)}</td>
      <td class="px-6 py-4 whitespace-nowrap">${new Date(payment.paymentDate).toLocaleDateString()}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        ${new Date(payment.paymentPeriod.from).toLocaleDateString('default', {month: 'long'})} ${new Date(payment.paymentPeriod.from).getFullYear()}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }">
          ${payment.status}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button class="text-blue-600 hover:text-blue-900 mr-3" onclick="printReceipt('${payment._id}')">
          <i class="fas fa-receipt"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Print receipt function
function printReceipt(paymentId) {
  console.log('Printing receipt for payment:', paymentId);
  // TODO: Implement receipt printing
}

// Get modal elements
const paymentModal = document.getElementById('paymentModal');
const paymentForm = document.getElementById('paymentForm');
const closePaymentModalBtn = document.getElementById('closePaymentModalBtn');
const recordPaymentBtn = document.querySelector('button.bg-blue-600');
const tenantSelect = document.getElementById('tenantSelect');

// Fetch tenants for dropdown
function fetchTenants() {
  fetch('/api/v1/tenants', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(response => response.json())
  .then(tenants => {
    tenants.forEach(tenant => {
      const option = document.createElement('option');
      option.value = tenant._id;
      option.textContent = `${tenant.name} (Room ${tenant.room.roomNumber})`;
      tenantSelect.appendChild(option);
    });
  })
  .catch(error => console.error('Error fetching tenants:', error));
}

// Show modal for recording payment
function showPaymentModal() {
  // Set default date to today
  document.getElementById('paymentDate').valueAsDate = new Date();
  paymentModal.classList.remove('hidden');
}

// Close modal
function closePaymentModal() {
  paymentModal.classList.add('hidden');
}

// Handle form submission
paymentForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const paymentData = {
    tenant: document.getElementById('tenantSelect').value,
    amount: document.getElementById('paymentAmount').value,
    paymentDate: document.getElementById('paymentDate').value,
    paymentPeriod: document.getElementById('paymentPeriod').value,
    paymentMethod: document.getElementById('paymentMethod').value
  };

  fetch('/api/v1/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(paymentData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Payment recorded:', data);
    closePaymentModal();
    fetchPayments(); // Refresh payment list
  })
  .catch(error => {
    console.error('Error recording payment:', error);
    alert('Error recording payment. Please try again.');
  });
});

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  console.log('Payment tracking page loaded');
  fetchPayments();
  fetchTenants(); // Fetch tenants for dropdown

  // Add click handler for "Record Payment" button
  recordPaymentBtn.addEventListener('click', showPaymentModal);

  // Add click handler for close modal button
  closePaymentModalBtn.addEventListener('click', closePaymentModal);
});