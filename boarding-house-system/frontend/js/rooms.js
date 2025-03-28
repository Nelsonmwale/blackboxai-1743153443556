// Fetch all rooms from API
function fetchRooms() {
  fetch('/api/v1/rooms', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('Rooms:', data);
    renderRooms(data);
  })
  .catch(error => {
    console.error('Error fetching rooms:', error);
  });
}

// Render rooms in the table
function renderRooms(rooms) {
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  rooms.forEach(room => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">${room.roomNumber}</td>
      <td class="px-6 py-4 whitespace-nowrap">${room.floor}</td>
      <td class="px-6 py-4 whitespace-nowrap">${room.capacity}</td>
      <td class="px-6 py-4 whitespace-nowrap">${room.currentOccupancy}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          room.status === 'available' ? 'bg-green-100 text-green-800' : 
          room.status === 'occupied' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
        }">
          ${room.status}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button class="text-blue-600 hover:text-blue-900 mr-3 edit-btn" data-id="${room._id}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="text-red-600 hover:text-red-900 delete-btn" data-id="${room._id}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('Room management page loaded');
  fetchRooms();

  // Get modal elements
  const modal = document.getElementById('roomModal');
  const modalTitle = document.getElementById('modalTitle');
  const roomForm = document.getElementById('roomForm');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const addRoomBtn = document.querySelector('button.bg-blue-600');

  // Current room being edited
  let currentRoomId = null;

  // Show modal for adding new room
  function showAddModal() {
    modalTitle.textContent = 'Add Room';
    currentRoomId = null;
    roomForm.reset();
    modal.classList.remove('hidden');
  }

  // Show modal for editing existing room
  function showEditModal(roomData) {
    modalTitle.textContent = 'Edit Room';
    currentRoomId = roomData._id;
    document.getElementById('roomNumber').value = roomData.roomNumber;
    document.getElementById('floor').value = roomData.floor;
    document.getElementById('capacity').value = roomData.capacity;
    document.getElementById('rentAmount').value = roomData.rentAmount;
    document.getElementById('status').value = roomData.status;
    modal.classList.remove('hidden');
  }

  // Close modal
  function closeModal() {
    modal.classList.add('hidden');
  }

  // Handle form submission
  roomForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const roomData = {
      roomNumber: document.getElementById('roomNumber').value,
      floor: document.getElementById('floor').value,
      capacity: document.getElementById('capacity').value,
      rentAmount: document.getElementById('rentAmount').value,
      status: document.getElementById('status').value
    };

    const apiUrl = currentRoomId 
      ? `/api/v1/rooms/${currentRoomId}`
      : '/api/v1/rooms';

    const method = currentRoomId ? 'PUT' : 'POST';

    fetch(apiUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(roomData)
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
      fetchRooms();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error saving room. Please try again.');
    });
  });

  // Add click handler for "Add Room" button
  if (addRoomBtn) {
    addRoomBtn.addEventListener('click', showAddModal);
  }

  // Add click handler for close modal button
  closeModalBtn.addEventListener('click', closeModal);

  // Add click handlers for edit buttons (delegated for dynamic elements)
  document.addEventListener('click', function(e) {
    if (e.target.closest('.edit-btn')) {
      const roomId = e.target.closest('.edit-btn').dataset.id;
      fetch(`/api/v1/rooms/${roomId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => response.json())
      .then(room => {
        // TODO: Show edit modal with room data
        console.log('Editing room:', room);
      })
      .catch(error => console.error('Error fetching room:', error));
    }

    if (e.target.closest('.delete-btn')) {
      const roomId = e.target.closest('.delete-btn').dataset.id;
      if (confirm('Are you sure you want to delete this room?')) {
        fetch(`/api/v1/rooms/${roomId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => {
          if (response.ok) {
            fetchRooms();
          }
        })
        .catch(error => console.error('Error deleting room:', error));
      }
    }
  });
});