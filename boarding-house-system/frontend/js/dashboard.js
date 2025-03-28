// Fetch dashboard analytics data
function fetchDashboardData() {
  Promise.all([
    fetch('/api/v1/tenants/count', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }),
    fetch('/api/v1/rooms/occupancy', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }),
    fetch('/api/v1/payments/summary', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }),
    fetch('/api/v1/maintenance/stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  ])
  .then(responses => Promise.all(responses.map(res => res.json())))
  .then(([tenants, occupancy, payments, maintenance]) => {
    renderDashboardMetrics(tenants, occupancy, payments, maintenance);
    renderCharts(tenants, occupancy, payments, maintenance);
    checkForAlerts(tenants, occupancy, payments, maintenance);
  })
  .catch(error => {
    console.error('Error fetching dashboard data:', error);
    showNotification('Failed to load dashboard data', 'error');
  });
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `p-3 border-b ${getNotificationColor(type)}`;
  notification.innerHTML = `
    <div class="flex items-start">
      <i class="fas ${getNotificationIcon(type)} mt-1 mr-2"></i>
      <div>${message}</div>
    </div>
    <div class="text-xs text-gray-500 mt-1">${new Date().toLocaleTimeString()}</div>
  `;
  document.getElementById('notificationsList').prepend(notification);
}

function getNotificationColor(type) {
  const colors = {
    info: 'bg-blue-50 border-blue-100',
    success: 'bg-green-50 border-green-100',
    warning: 'bg-yellow-50 border-yellow-100',
    error: 'bg-red-50 border-red-100'
  };
  return colors[type] || colors.info;
}

function getNotificationIcon(type) {
  const icons = {
    info: 'fa-info-circle text-blue-500',
    success: 'fa-check-circle text-green-500',
    warning: 'fa-exclamation-triangle text-yellow-500',
    error: 'fa-times-circle text-red-500'
  };
  return icons[type] || icons.info;
}

// Check for important alerts
function checkForAlerts(tenants, occupancy, payments, maintenance) {
  if (maintenance.highPriority > 0) {
    showNotification(`${maintenance.highPriority} high priority maintenance issues`, 'warning');
  }
  if (payments.pending > 5) {
    showNotification(`${payments.pending} pending payments`, 'warning');
  }
  if (occupancy.rate > 90) {
    showNotification('High occupancy - only ' + occupancy.available + ' rooms available', 'info');
  }
}

// Export functionality
function setupExport() {
  const exportModal = document.getElementById('exportModal');
  const exportForm = document.getElementById('exportForm');
  
  // Set default dates
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  document.getElementById('exportStartDate').valueAsDate = firstDay;
  document.getElementById('exportEndDate').valueAsDate = today;

  // Export form handler
  exportForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const exportData = {
      type: document.getElementById('exportType').value,
      startDate: document.getElementById('exportStartDate').value,
      endDate: document.getElementById('exportEndDate').value,
      format: document.querySelector('input[name="exportFormat"]:checked').value
    };

    fetch('/api/v1/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(exportData)
    })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportData.type}_report.${exportData.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      showNotification('Export completed successfully', 'success');
    })
    .catch(error => {
      console.error('Export error:', error);
      showNotification('Export failed', 'error');
    })
    .finally(() => {
      exportModal.classList.add('hidden');
    });
  });

  // Clear notifications
  document.getElementById('clearNotifications').addEventListener('click', () => {
    document.getElementById('notificationsList').innerHTML = '';
  });
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  console.log('Dashboard loaded');
  fetchDashboardData();
  setupExport();

  // Check for new data every 5 minutes
  setInterval(fetchDashboardData, 300000);
});