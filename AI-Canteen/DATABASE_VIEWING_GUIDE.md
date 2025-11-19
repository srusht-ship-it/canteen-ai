# MongoDB Database Viewing Guide

## 🗄️ How to View Your AI Canteen Database

You have several options to view and interact with your MongoDB database:

---

## Option 1: MongoDB Compass (Recommended - GUI) 🖥️

**Best for:** Visual interface, easy browsing, beginners

### Installation:

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Install the application
3. Open MongoDB Compass

### Connect:

1. Connection String: `mongodb://localhost:27017`
2. Click "Connect"
3. Navigate to `ai-canteen` database
4. Click on `users` collection to see all users

### Features:

- ✅ Visual interface for browsing data
- ✅ Query builder
- ✅ Document editing
- ✅ Performance insights
- ✅ Schema analysis

---

## Option 2: MongoDB Shell (mongosh) 💻

**Best for:** Quick queries, command-line users

### Open MongoDB Shell:

```powershell
mongosh
```

### Basic Commands:

```javascript
// Show all databases
show dbs

// Use the ai-canteen database
use ai-canteen

// Show all collections (tables)
show collections

// View all users
db.users.find()

// View users in a pretty format
db.users.find().pretty()

// Count total users
db.users.countDocuments()

// Find a specific user by email
db.users.findOne({ emailOrPhone: "test@example.com" })

// Find users with specific dietary preference
db.users.find({ dietaryPreferences: "vegetarian" })

// View only specific fields (excluding password)
db.users.find({}, { fullName: 1, emailOrPhone: 1, dietaryPreferences: 1 })

// Exit mongosh
exit
```

---

## Option 3: VS Code Extension 🔧

**Best for:** Working within VS Code

### Installation:

1. Open VS Code Extensions (Ctrl+Shift+X)
2. Search for "MongoDB for VS Code"
3. Install the official MongoDB extension by MongoDB

### Connect:

1. Click MongoDB icon in sidebar
2. Click "Add Connection"
3. Use connection string: `mongodb://localhost:27017`
4. Browse your `ai-canteen` database

---

## Option 4: Quick PowerShell Script 📜

**Best for:** Quick checks without opening new tools

### View All Users:

```powershell
mongosh --eval "use ai-canteen; db.users.find().pretty()"
```

### Count Users:

```powershell
mongosh --eval "use ai-canteen; db.users.countDocuments()"
```

### View Specific User:

```powershell
mongosh --eval "use ai-canteen; db.users.findOne({ emailOrPhone: 'test@example.com' })"
```

---

## Option 5: Backend API Route (Create a new endpoint) 🛠️

Add this to your backend for development viewing:

### Add to `backend/routes/auth.js`:

```javascript
// Get all users (development only - remove in production!)
router.get("/users", authController.getAllUsers);
```

### Add to `backend/controllers/authController.js`:

```javascript
// @desc    Get all users (DEVELOPMENT ONLY)
// @route   GET /api/auth/users
// @access  Public (should be protected in production)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};
```

Then visit: `http://localhost:5000/api/auth/users`

---

## MongoDB Shell Quick Reference 📚

### Database Operations:

```javascript
show dbs                    // List all databases
use ai-canteen             // Switch to ai-canteen database
db.getName()               // Show current database
db.dropDatabase()          // Delete database (careful!)
```

### Collection Operations:

```javascript
show collections           // List all collections
db.users.find()           // Get all documents
db.users.findOne()        // Get one document
db.users.countDocuments() // Count documents
db.users.drop()           // Delete collection (careful!)
```

### Query Operations:

```javascript
// Find all
db.users.find();

// Find with condition
db.users.find({ role: "user" });

// Find one
db.users.findOne({ emailOrPhone: "test@example.com" });

// Find with multiple conditions
db.users.find({
  role: "user",
  dietaryPreferences: "vegan",
});

// Find with projection (select specific fields)
db.users.find(
  {},
  {
    fullName: 1,
    emailOrPhone: 1,
    _id: 0,
  }
);

// Sort results
db.users.find().sort({ createdAt: -1 });

// Limit results
db.users.find().limit(5);

// Skip and limit (pagination)
db.users.find().skip(10).limit(5);
```

### Update Operations:

```javascript
// Update one document
db.users.updateOne(
  { emailOrPhone: "test@example.com" },
  { $set: { fullName: "Updated Name" } }
);

// Update many documents
db.users.updateMany({ role: "user" }, { $set: { isVerified: true } });
```

### Delete Operations:

```javascript
// Delete one document
db.users.deleteOne({ emailOrPhone: "test@example.com" });

// Delete many documents
db.users.deleteMany({ isVerified: false });
```

---

## Useful MongoDB Queries for AI Canteen 🍽️

### Check User Registration:

```javascript
// View all registered users
db.users
  .find(
    {},
    {
      fullName: 1,
      emailOrPhone: 1,
      dietaryPreferences: 1,
      createdAt: 1,
    }
  )
  .pretty();

// Count users by role
db.users.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);

// Count users by dietary preference
db.users.aggregate([
  { $unwind: "$dietaryPreferences" },
  { $group: { _id: "$dietaryPreferences", count: { $sum: 1 } } },
]);

// Find recently registered users
db.users.find().sort({ createdAt: -1 }).limit(10).pretty();

// Find users without dietary preferences
db.users.find({ dietaryPreferences: { $size: 0 } });
```

---

## MongoDB Compass Features 🎨

When you open MongoDB Compass, you can:

1. **Browse Collections:**

   - Click `ai-canteen` → `users`
   - See all user documents

2. **Search/Filter:**

   - Use the filter bar: `{ "role": "user" }`
   - Advanced queries with MongoDB query syntax

3. **View Schema:**

   - See field types and distribution
   - Analyze data patterns

4. **Edit Documents:**

   - Click any document
   - Modify fields directly
   - Save changes

5. **Run Aggregations:**

   - Build aggregation pipelines visually
   - Analyze data trends

6. **Import/Export:**
   - Export data to JSON/CSV
   - Import data from files

---

## Security Note ⚠️

**Important:** When viewing the database, you'll notice:

- Passwords are HASHED (bcrypt) - you cannot see plain text passwords
- This is a security feature
- You cannot reverse the hash to get the original password

Example:

```json
{
  "_id": "...",
  "fullName": "John Doe",
  "emailOrPhone": "john@example.com",
  "password": "$2a$10$xyz123...", // This is the hashed password
  "dietaryPreferences": ["vegetarian"]
}
```

---

## Recommended Setup 🌟

**For Development:**

1. Install **MongoDB Compass** for visual browsing
2. Keep **mongosh** handy for quick queries
3. Install **MongoDB VS Code extension** for in-editor access

**Quick Check:**

```powershell
# In PowerShell
mongosh --eval "use ai-canteen; db.users.find().count()"
```

---

## Troubleshooting 🔧

### Can't connect to MongoDB:

```powershell
# Check if MongoDB is running
net start MongoDB

# Or check status
Get-Service -Name "MongoDB"
```

### mongosh not found:

- MongoDB Shell (mongosh) comes with MongoDB installation
- Make sure MongoDB bin folder is in your PATH
- Or use full path: `"C:\Program Files\MongoDB\Server\7.0\bin\mongosh.exe"`

### Database not showing up:

- Make sure backend server created the database
- Run: `mongosh --eval "show dbs"`
- Database appears only after first document is inserted
- Try registering a user first

---

## Next Steps 📝

1. **Install MongoDB Compass** (if not already installed)
2. **Connect to** `mongodb://localhost:27017`
3. **Browse** the `ai-canteen` database
4. **View** the `users` collection
5. **Register a test user** from your frontend
6. **Refresh** Compass to see the new user

---

**Quick Start:**

```powershell
# Open MongoDB Shell
mongosh

# Then run these commands:
use ai-canteen
db.users.find().pretty()
```

This will show you all users in a readable format! 🎉
