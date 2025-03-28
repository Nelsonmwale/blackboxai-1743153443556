// Fetch all maintenance requests from API
function fetchMaintenanceRequests() {
  fetch('/api/v1/maintenance', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('Maintenance requests:', data);
    renderMaintenanceRequests(data);
  })
  .catch(error => {
    console.error('Error fetching maintenance requests:', error);
  });
}

// Render maintenance requests in the table
function renderMaintenanceRequests(requests) {
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  requests.forEach(request => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">MR-${request._id.substring(0, 4)}</td>
      <td class="px-6 py-4 whitespace-nowrap">${request.room.roomNumber}</td>
      <td class="px-6 py-4 whitespace-nowrap">${request.issue}</td>
      <td class="px-6 py-4 whitespace-nowrap">${new Date(request.dateReported).toLocaleDateString()}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          request.status === 'completed' ? 'bg-green-100 text-green-800' :
          request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
        }">
          ${request.status.replace('_', ' ')}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button class="text-blue-600 hover:text-blue-900 mr-3 edit-btn" data-id="${request._id}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="text-red-600 hover:text-red-900 delete-btn" data-id="${request._id}">
          <i class="fas fa-trash"></i>
        </button>
        ${request.status !== 'completed' ? `
        <button class="text-green-600 hover:text-green-900 status-btn" data-id="${request._id}" data-status="completed">
          <i class="fas fa-check"></i>
        </button>
        ` : ''}
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Get modal elements
const maintenanceModal = document.getElementById('maintenanceModal');
const maintenanceForm = document.getElementById('maintenanceForm');
const closeMaintenanceModalBtn = document.getElementById('closeMaintenanceModalBtn');
const newRequestBtn = document.querySelector('button.bg-blue-600');
const roomSelect = document.getElementById('roomSelect');

// Fetch rooms for dropdown
function fetchRooms() {
  fetch('/api/v1/rooms', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(response => response.json())
  .then(rooms => {
    roomSelect.innerHTML = '<option value="">Select Room</option>';
    rooms.forEach(room => {
      const option = document.createElement('option');
      option.value = room._id;
      option.textContent = `Room ${room.roomNumber}`;
      roomSelect.appendChild(option);
    });
  })
  .catch(error => console.error('Error fetching rooms:', error));
}

// Show modal for new maintenance request
function showMaintenanceModal() {
  maintenanceForm.reset();
  maintenanceModal.classList.remove('hidden');
}

// Close modal
function closeMaintenanceModal() {
  maintenanceModal.classList.add('hidden');
}

// Handle form submission
maintenanceForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const maintenanceData = {
    room: roomSelect.value,
    issue: document.getElementById('issue').value,
    priority: document.getElementById('priority').value,
    status: 'pending'
  };

  fetch('/api/v1/maintenance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(maintenanceData)
  })
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => {
    console.log('Request submitted:', data);
    closeMaintenanceModal();
    fetchMaintenanceRequests();
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error submitting request. Please try again.');
  });
});

// Update request status
function updateRequestStatus(requestId, status) {
  fetch(`/api/v1/maintenance/${requestId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ status })
  })
  .then(response => {
    if (response.ok) fetchMaintenanceRequests();
  })
  .catch(error => console.error('Error updating status:', error));
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  console.log('Maintenance page loaded');
  fetchMaintenanceRequests();
  fetchRooms();

  newRequestBtn.addEventListener('click', showMaintenanceModal);
  closeMaintenanceModalBtn.addEventListener('click', closeMaintenanceModal);

  document.addEventListener('click', function(e) {
    if (e.target.closest('.edit-btn')) {
      const requestId = e.target.closest('.edit-btn').dataset.id;
      // TODO: Implement edit functionality
      console.log('Edit request:', requestId);
    }

    if (e.target.closest('.delete-btn')) {
      const requestId = e.target.closest('.delete-btn').dataset.id;
      if (confirm('Delete this maintenance request?')) {
        fetch(`/api/v1/maintenance/${requestId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => {
          if (response.ok) fetchMaintenanceRequests();
        })
        .catch(error => console.error('Error deleting:', error));
      }
    }

    if (e.target.closest('.status-btn')) {
      const btn = e.target.closest('.status-btn');
      updateRequestStatus(btn.dataset.id, btn.dataset.status);
    }
  });
});