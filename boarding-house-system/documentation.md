# Boarding House Management System Documentation

## System Overview
A complete web-based management system for boarding houses with:
- Tenant management
- Room management
- Payment tracking
- Maintenance requests
- Dashboard analytics

## Key Features

### 1. Tenant Management
- Add/edit/delete tenant records
- View tenant details
- Search and filter functionality
- Responsive design for all devices

### 2. Room Management
- Room status tracking (available/occupied/maintenance)
- Capacity management
- Floor-wise organization
- Visual indicators for room status

### 3. Payment Tracking
- Record rent payments
- Payment history
- Receipt generation
- Payment status tracking

### 4. Maintenance Requests
- Submit maintenance tickets
- Priority levels (low/medium/high/emergency)
- Status tracking (pending/in progress/completed)
- Assignment to staff

### 5. Dashboard Analytics
- Real-time metrics
- Visual charts and graphs
- Notifications system
- Data export functionality

## Technical Implementation

### Frontend
- HTML5, CSS3, JavaScript
- Tailwind CSS for styling
- Chart.js for visualizations
- Font Awesome icons
- Responsive design

### Backend
- Node.js/Express.js
- MongoDB database
- RESTful API endpoints
- JWT authentication

## File Structure
```
boarding-house-system/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── login.html
│   ├── tenants.html
│   ├── rooms.html
│   ├── payments.html
│   └── maintenance.html
└── documentation.md
```

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/v1/tenants | GET | Get all tenants |
| /api/v1/tenants | POST | Create new tenant |
| /api/v1/rooms | GET | Get all rooms |
| /api/v1/payments | POST | Record payment |
| /api/v1/maintenance | GET | Get maintenance requests |

## Getting Started
1. Install dependencies: `npm install`
2. Start backend server: `node server.js`
3. Open frontend: `python3 -m http.server 8000 -d frontend`
4. Access system at: `http://localhost:8000`

## Screenshots
![Dashboard](dashboard.png)
![Tenant Management](tenants.png)
![Room Management](rooms.png)