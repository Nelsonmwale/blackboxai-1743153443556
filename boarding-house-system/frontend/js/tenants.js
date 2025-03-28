// Fetch all tenants from API
function fetchTenants() {
  fetch('/api/v1/tenants', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('Tenants:', data);
    renderTenants(data);
  })
  .catch(error => {
    console.error('Error fetching tenants:', error);
  });
}

// Render tenants in the table
function renderTenants(tenants) {
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  tenants.forEach(tenant => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <i class="fas fa-user text-blue-600"></i>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900">${tenant.name}</div>
            <div class="text-sm text-gray-500">ID: ${tenant._id}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${tenant.room}</div>
        <div class="text-sm text-gray-500">Floor ${tenant.room.charAt(0)}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${tenant.email}</div>
        <div class="text-sm text-gray-500">${tenant.phone}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }">
          ${tenant.status}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button class="text-blue-600 hover:text-blue-900 mr-3 edit-btn" data-id="${tenant._id}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="text-red-600 hover:text-red-900 delete-btn" data-id="${tenant._id}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('Tenant management page loaded');
  fetchTenants();

  // Get modal elements
  const modal = document.getElementById('tenantModal');
  const modalTitle = document.getElementById('modalTitle');
  const tenantForm = document.getElementById('tenantForm');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const addTenantBtn = document.querySelector('button.bg-blue-600');

  // Current tenant being edited
  let currentTenantId = null;

  // Show modal for adding new tenant
  function showAddModal() {
    modalTitle.textContent = 'Add Tenant';
    currentTenantId = null;
    tenantForm.reset();
    modal.classList.remove('hidden');
  }

  // Show modal for editing existing tenant
  function showEditModal(tenantData) {
    modalTitle.textContent = 'Edit Tenant';
    currentTenantId = tenantData.id;
    document.getElementById('tenantName').value = tenantData.name;
    document.getElementById('tenantRoom').value = tenantData.room;
    document.getElementById('tenantContact').value = tenantData.contact;
    document.getElementById('tenantStatus').value = tenantData.status;
    modal.classList.remove('hidden');
  }

  // Close modal
  function closeModal() {
    modal.classList.add('hidden');
  }

  // Handle form submission
  tenantForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const tenantData = {
      name: document.getElementById('tenantName').value,
      room: document.getElementById('tenantRoom').value,
      contact: document.getElementById('tenantContact').value,
      status: document.getElementById('tenantStatus').value
    };

    const apiUrl = currentTenantId 
      ? `/api/v1/tenants/${currentTenantId}`
      : '/api/v1/tenants';

    const method = currentTenantId ? 'PUT' : 'POST';

    fetch(apiUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(tenantData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      closeModal();
      // Refresh tenant list
      fetchTenants();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error saving tenant. Please try again.');
    });
  });

  // Add click handler for "Add Tenant" button
  if (addTenantBtn) {
    addTenantBtn.addEventListener('click', showAddModal);
  }

  // Add click handler for close modal button
  closeModalBtn.addEventListener('click', closeModal);

  // Add click handlers for edit buttons
  document.querySelectorAll('button.text-blue-600').forEach(btn => {
    btn.addEventListener('click', function() {
      // TODO: Get actual tenant data from row
      const tenantData = {
        id: 'TN-001', // Example ID
        name: 'John Doe',
        room: 'Room 101',
        contact: 'john@example.com',
        status: 'active'
      };
      showEditModal(tenantData);
    });
  });

  // Add click handlers for delete buttons
  document.querySelectorAll('button.text-red-600').forEach(btn => {
    btn.addEventListener('click', function() {
      // TODO: Show delete confirmation
      if (confirm('Are you sure you want to delete this tenant?')) {
        console.log('Deleting tenant');
      }
    });
  });

  // Close modal when clicking outside
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
});