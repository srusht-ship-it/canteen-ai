# 🎯 Admin Dashboard - AI Canteen Management System

## Overview

The Admin Dashboard is a comprehensive management interface for canteen staff to monitor and manage all operations in real-time. It provides powerful tools for order management, sales analytics, and system administration.

## 🚀 Features

### 1. **Real-time Order Management**

- View all orders with live updates (auto-refresh every 10 seconds)
- Color-coded status indicators (Pending, Confirmed, Preparing, Ready, Completed, Cancelled)
- Quick status update buttons with workflow guidance
- Detailed order view with customer information
- Order filtering by status
- Visual alerts for pending orders

### 2. **Sales Analytics Dashboard**

- **Revenue Metrics:**
  - Total revenue across all orders
  - Average order value calculation
  - Daily revenue trends with line charts
- **Order Statistics:**
  - Total orders count
  - Status distribution (pie chart)
  - Active orders monitoring
- **Customer Insights:**
  - Total registered customers
  - Customer activity tracking
- **Popular Items Analysis:**
  - Top 10 best-selling menu items
  - Order frequency tracking
  - Revenue by item (bar charts)
- **Visual Analytics:**
  - Interactive charts using Chart.js
  - Daily revenue trend line graph
  - Status distribution pie chart
  - Popular items bar chart

### 3. **Order Workflow Management**

- **Status Flow:** pending → confirmed → preparing → ready → completed
- One-click status updates
- Automatic status history tracking
- Order cancellation capability (pending orders only)
- Special instructions visibility

### 4. **Dashboard Statistics**

- Real-time summary cards:
  - Total Orders
  - Pending Orders (requires immediate attention)
  - In Progress (confirmed + preparing)
  - Ready for Pickup

## 📁 File Structure

```
my-frontend/src/pages/admin/
├── AdminDashboard.js        # Main dashboard container with tabs
├── AdminDashboard.css       # Styling for admin interface
├── OrderManagement.js       # Order listing and management
├── SalesAnalytics.js        # Analytics and charts
├── MenuManagement.js        # Menu CRUD (placeholder)
└── UserManagement.js        # User management (placeholder)

backend/
├── controllers/
│   └── adminController.js   # Admin-specific business logic
└── routes/
    └── admin.js             # Admin API routes
```

## 🔐 Access Control

### Role-Based Authentication

- **Required Role:** `admin`
- **Protection:** All admin routes are protected by:
  1. `protect` middleware - Validates JWT token
  2. `authorize('admin')` middleware - Checks user role

### Access Flow:

```javascript
1. User logs in with admin credentials
2. JWT token stored in localStorage
3. Token sent with every admin API request
4. Backend verifies token and role
5. Access granted/denied based on role
```

### How to Access:

1. Navigate to `/admin` route
2. System checks if user is logged in and has admin role
3. If not admin: Redirected to home with error message
4. If admin: Dashboard loads

## 🛠️ API Endpoints

### Admin Routes (`/api/admin/*`)

| Method | Endpoint             | Description           | Response                                 |
| ------ | -------------------- | --------------------- | ---------------------------------------- |
| GET    | `/orders`            | Get all orders        | Array of orders with user & item details |
| PUT    | `/orders/:id/status` | Update order status   | Updated order object                     |
| GET    | `/analytics`         | Get sales analytics   | Analytics data with charts               |
| GET    | `/stats`             | Get dashboard summary | Quick stats for today                    |

### Request Examples:

**Get All Orders:**

```javascript
GET /api/admin/orders
Headers: { Authorization: "Bearer <admin_token>" }

Response: {
  success: true,
  count: 45,
  data: [
    {
      _id: "...",
      orderNumber: "ORD-20251106-0001",
      user: { name: "John Doe", email: "john@example.com" },
      items: [...],
      status: "pending",
      total: 350.00,
      createdAt: "2025-11-06T10:30:00Z"
    },
    ...
  ]
}
```

**Update Order Status:**

```javascript
PUT /api/admin/orders/ORDER_ID/status
Headers: { Authorization: "Bearer <admin_token>" }
Body: { status: "confirmed" }

Response: {
  success: true,
  message: "Order status updated to confirmed",
  data: { ...updated order... }
}
```

**Get Analytics:**

```javascript
GET /api/admin/analytics?startDate=2025-11-01&endDate=2025-11-30
Headers: { Authorization: "Bearer <admin_token>" }

Response: {
  success: true,
  data: {
    totalRevenue: 15000.00,
    totalOrders: 120,
    averageOrderValue: 125.00,
    totalCustomers: 45,
    statusBreakdown: {
      pending: 5,
      confirmed: 8,
      preparing: 3,
      ready: 2,
      completed: 95,
      cancelled: 7
    },
    dailyRevenue: [
      { date: "2025-11-01", revenue: 500.00, orders: 4 },
      ...
    ],
    popularItems: [
      { name: "Masala Dosa", orderCount: 25, totalQuantity: 30, totalRevenue: 750.00 },
      ...
    ]
  }
}
```

## 💻 Usage Guide

### For Canteen Staff:

#### 1. **Managing Orders**

```
Step 1: Login with admin credentials
Step 2: Navigate to /admin
Step 3: View Orders tab (default)
Step 4: See all orders sorted by priority (pending first)
Step 5: Click "View Details" to see full order information
Step 6: Click status buttons to move order through workflow:
        - "Mark as confirmed" (for pending orders)
        - "Mark as preparing" (for confirmed orders)
        - "Mark as ready" (for preparing orders)
        - "Mark as completed" (for ready orders)
```

#### 2. **Viewing Analytics**

```
Step 1: Click on "Analytics" tab
Step 2: View summary cards at top:
        - Total Revenue
        - Total Orders
        - Average Order Value
        - Total Customers
Step 3: Analyze charts:
        - Daily Revenue Trend (line chart)
        - Orders by Status (pie chart)
        - Popular Menu Items (bar chart)
```

#### 3. **Filtering Orders**

```
Step 1: Use status dropdown filter
Step 2: Select desired status:
        - All Orders
        - Pending (needs immediate attention)
        - Confirmed
        - Preparing
        - Ready (needs pickup/delivery)
        - Completed
        - Cancelled
Step 3: View filtered results
```

### For Developers:

#### Adding a New Admin Feature:

1. **Create Backend Controller:**

```javascript
// backend/controllers/adminController.js
exports.newFeature = async (req, res) => {
  try {
    // Your logic here
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error message",
      error: error.message,
    });
  }
};
```

2. **Add Route:**

```javascript
// backend/routes/admin.js
router.get("/new-feature", newFeature);
```

3. **Add API Method:**

```javascript
// my-frontend/src/services/api.js
export const adminAPI = {
  // ... existing methods
  newFeature: async () => {
    try {
      const response = await api.get("/admin/new-feature");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed" };
    }
  },
};
```

4. **Create React Component:**

```javascript
// my-frontend/src/pages/admin/NewFeature.js
import React, { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";

const NewFeature = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await adminAPI.newFeature();
      setData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return <div>{/* Your UI */}</div>;
};

export default NewFeature;
```

5. **Add to Dashboard:**

```javascript
// my-frontend/src/pages/admin/AdminDashboard.js
import NewFeature from './NewFeature';

// Add tab
<Nav.Item>
  <Nav.Link eventKey="new-feature">
    <i className="bi bi-icon me-2"></i>
    New Feature
  </Nav.Link>
</Nav.Item>

// Add pane
<Tab.Pane eventKey="new-feature">
  <NewFeature />
</Tab.Pane>
```

## 🎨 UI/UX Features

### Design Elements:

- **Color-coded Status Badges:**

  - 🟡 Pending (Yellow/Warning)
  - 🔵 Confirmed (Blue/Info)
  - 🔷 Preparing (Primary Blue)
  - 🟢 Ready (Green/Success)
  - ✅ Completed (Green/Success)
  - 🔴 Cancelled (Red/Danger)

- **Responsive Layout:**

  - Desktop: Sidebar navigation
  - Mobile: Top tabs (horizontal scroll)

- **Interactive Charts:**

  - Hover tooltips
  - Responsive sizing
  - Professional color schemes

- **Real-time Updates:**
  - Auto-refresh every 10 seconds
  - Manual refresh button
  - Loading spinners

## 🔄 Order Status Workflow

```
┌─────────┐
│ PENDING │ ← New order arrives
└────┬────┘
     │ Staff clicks "Mark as confirmed"
     ↓
┌───────────┐
│ CONFIRMED │ ← Order acknowledged
└─────┬─────┘
      │ Staff clicks "Mark as preparing"
      ↓
┌───────────┐
│ PREPARING │ ← Food being made
└─────┬─────┘
      │ Staff clicks "Mark as ready"
      ↓
┌────────┐
│ READY  │ ← Ready for pickup/delivery
└───┬────┘
    │ Staff clicks "Mark as completed"
    ↓
┌───────────┐
│ COMPLETED │ ← Order fulfilled
└───────────┘

Note: CANCELLED status can only be set from PENDING
```

## 📊 Analytics Calculations

### Revenue Metrics:

```javascript
totalRevenue = Sum of all (completed + ready + preparing + confirmed) orders' total
averageOrderValue = totalRevenue / totalOrders
```

### Status Breakdown:

```javascript
For each status, count orders matching that status
Display in pie chart with percentages
```

### Daily Revenue:

```javascript
Group orders by date (YYYY-MM-DD format)
Sum total for each day
Display in line chart chronologically
```

### Popular Items:

```javascript
Unwind order items array
Group by menuItem._id
Count order frequency
Sum quantities and revenue
Sort by orderCount descending
Take top 10
```

## 🔧 Configuration

### Auto-refresh Interval:

```javascript
// OrderManagement.js, line 30
const interval = setInterval(fetchOrders, 10000); // 10 seconds
```

### Chart Colors:

```javascript
// SalesAnalytics.js
backgroundColor: [
  "#ffc107", // Pending - Yellow
  "#17a2b8", // Confirmed - Cyan
  "#007bff", // Preparing - Blue
  "#28a745", // Ready - Green
  "#28a745", // Completed - Green
  "#dc3545", // Cancelled - Red
];
```

### Analytics Date Range:

```javascript
// Default: Last 30 days
const end = new Date();
const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
```

## 🚦 Testing the Admin Dashboard

### 1. Create Admin User:

```javascript
// Use MongoDB Compass or shell
db.users.updateOne({ email: "admin@canteen.com" }, { $set: { role: "admin" } });
```

### 2. Test Order Management:

```
1. Place orders as a student user
2. Login as admin
3. Navigate to /admin
4. Verify orders appear in list
5. Test status updates
6. Verify real-time refresh
```

### 3. Test Analytics:

```
1. Ensure some completed orders exist
2. Navigate to Analytics tab
3. Verify all charts render
4. Check data accuracy
5. Test date range filters (if implemented)
```

## 🐛 Troubleshooting

### Common Issues:

**1. "Access Denied" Message:**

```
Solution: Ensure logged-in user has role: 'admin'
Check: localStorage.getItem('user') → role should be 'admin'
```

**2. Orders Not Loading:**

```
Solution:
- Check MongoDB connection
- Verify backend running on port 5000
- Check browser console for API errors
- Verify JWT token in localStorage
```

**3. Charts Not Rendering:**

```
Solution:
- Ensure chart.js and react-chartjs-2 installed
- Check if analytics data has correct structure
- Verify Chart.js registration in component
```

**4. Status Update Fails:**

```
Solution:
- Check if user is admin
- Verify order ID is correct
- Check backend logs for errors
- Ensure valid status transitions
```

## 🔮 Future Enhancements

### Phase 2 (Upcoming):

1. **Menu Management:**

   - Add/Edit/Delete menu items
   - Update prices and availability
   - Upload/change images
   - Category management

2. **User Management:**

   - View all users
   - User order history
   - Manage roles
   - Block/unblock users

3. **Advanced Analytics:**

   - Export reports (Excel/PDF)
   - Peak hours analysis
   - Revenue forecasting
   - Customer segmentation

4. **Real-time Notifications:**

   - WebSocket integration
   - Push notifications for new orders
   - Sound alerts
   - Browser notifications

5. **Inventory Management:**
   - Stock tracking
   - Low stock alerts
   - Automatic item disable when out of stock

## 📝 Notes

- Admin dashboard requires admin role - regular users cannot access
- All monetary values in Indian Rupees (₹)
- Timestamps in ISO 8601 format
- Auto-refresh can be disabled by commenting out interval
- Charts use Chart.js v4 with React-Chartjs-2
- Responsive design works on tablets and desktops (mobile view needs optimization)

## 🎉 Success!

Your Admin Dashboard is now fully functional! Canteen staff can:

- ✅ View all orders in real-time
- ✅ Update order status with workflow guidance
- ✅ Monitor sales performance with visual analytics
- ✅ Track popular items and customer trends
- ✅ Filter and search orders efficiently

Access at: `http://localhost:3000/admin` (after login as admin)

---

**Made with ❤️ for VIT Canteen Management**
