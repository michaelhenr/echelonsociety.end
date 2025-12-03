# How to Run Postman and Test APIs

## Prerequisites
- Postman installed ([Download here](https://www.postman.com/downloads/))
- Backend server running on `http://localhost:3400`
- Database connection configured (MongoDB)

## Step-by-Step Setup Guide

### Step 1: Start Your Backend Server
```powershell
cd backend
npm install
npm start
# or for development with auto-reload
npm run start:dev
```
✅ You should see: `Server is listening on port 3400`

### Step 2: Verify Server Health
```bash
# Test in browser or curl
curl http://localhost:3400/
# Response: "test"
```

### Step 3: Import Postman Collection
1. Open **Postman**
2. Click **Import** (top-left)
3. Select **Upload Files**
4. Choose `Echelon-Society-API.postman_collection.json`
5. Click **Import**

### Step 4: Import Environment
1. Click gear icon (⚙️) in top-right
2. Click **Manage Environments**
3. Click **Import**
4. Select `Echelon-Society-Local.postman_environment.json`
5. Click **Import**

### Step 5: Activate Environment
1. In top-right dropdown, select **Echelon Society - Local**
2. Verify base URL shows: `http://localhost:3400`

---

## Testing Workflow

### 1️⃣ Health Check (Start Here)
```
Method: GET
URL: {{baseUrl}}/
Expected: Status 200, Body: "test"
```

**Steps:**
1. Select **Health Check** → **Server Status**
2. Click **Send**
3. Look for blue **200** response

### 2️⃣ Create a User
```
Method: POST
URL: {{baseUrl}}/user
```

**Steps:**
1. Go to **User Management** → **Create User**
2. Check **Body** tab - review JSON:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "customer"
}
```
3. Modify email/name if needed
4. Click **Send**
5. ✅ Should get **201** status with user ID

**Copy the returned `_id`:**
- In response, find `"_id": "xxx"`
- Copy this value

### 3️⃣ Store User ID in Environment
1. Click gear icon (⚙️)
2. Select **Echelon Society - Local** to edit
3. Find `userId` variable
4. Paste the ID in **Current Value**
5. Click **Save**

### 4️⃣ Get User by ID
```
Method: GET
URL: {{baseUrl}}/user/:userId
```

**Steps:**
1. Go to **User Management** → **Get User by ID**
2. URL automatically uses `{{userId}}` from environment
3. Click **Send**
4. ✅ Should return the user you created

### 5️⃣ Create a Product
```
Method: POST
URL: {{baseUrl}}/product
```

**Steps:**
1. Go to **Product Management** → **Create Product**
2. Click **Body** tab
3. Edit the JSON (example):
```json
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 1299.99,
  "category": "electronics",
  "stock": 25,
  "image": "https://example.com/laptop.jpg"
}
```
4. Click **Send**
5. ✅ Should get **201** with product ID
6. Copy `_id` and save to environment as `productId`

### 6️⃣ Create an Order
```
Method: POST
URL: {{baseUrl}}/cart
```

**Steps:**
1. Go to **Orders** → **Create Order**
2. Update body with real IDs:
```json
{
  "userId": "{{userId}}",
  "items": [
    {
      "productId": "{{productId}}",
      "quantity": 2,
      "price": 1299.99
    }
  ],
  "shippingAddress": "123 Main St, Anytown, USA",
  "paymentMethod": "credit_card"
}
```
3. Click **Send**
4. ✅ Should get **201** with order ID

### 7️⃣ Test Notifications
```
Method: POST
URL: {{baseUrl}}/notifications
```

**Steps:**
1. Go to **Notifications** → **Create Notification**
2. Update body:
```json
{
  "userId": "{{userId}}",
  "type": "order_status",
  "message": "Your order has been confirmed",
  "data": {
    "orderId": "{{orderId}}"
  }
}
```
3. Click **Send**

### 8️⃣ Test Chat (Real-time)
```
Method: POST
URL: {{baseUrl}}/chat/message
```

**Steps:**
1. Go to **Chat** → **Send Message**
2. Update with your user IDs:
```json
{
  "conversationId": "conv-demo-123",
  "senderId": "{{userId}}",
  "receiverId": "another-user-id",
  "message": "Hello from Postman!",
  "timestamp": "2025-12-03T10:30:00Z"
}
```
3. Click **Send**

---

## Full Test Sequence (Best Practice)

### Complete Testing Flow:
```
1. Health Check ✓
   └─ Server Status
   
2. User Operations ✓
   ├─ Create User → Save ID
   ├─ Get User by ID
   ├─ Update User
   └─ Get All Users
   
3. Product Operations ✓
   ├─ Create Product → Save ID
   ├─ Get Product by ID
   ├─ Update Product
   └─ Get All Products
   
4. Order Operations ✓
   ├─ Create Order (uses userId + productId) → Save ID
   ├─ Get Order by ID
   └─ Update Order Status
   
5. Notifications ✓
   ├─ Create Notification (uses userId) → Save ID
   └─ Get Notifications
   
6. Chat ✓
   ├─ Send Message (uses userId)
   └─ Get Chat History
```

---

## Using Postman Collection Runner (Automated Testing)

### Run All Tests at Once:
1. Click **Runner** button (top-left area)
2. Select **Echelon Society API** collection
3. Select environment: **Echelon Society - Local**
4. Set **Iterations**: 1
5. Set **Delay**: 1000ms (between requests)
6. Click **Run**

✅ Postman will automatically run all requests in sequence

---

## Postman Console (Debugging)

### View Request/Response Details:
1. After sending a request, scroll down to **Response**
2. Click **Console** tab at bottom (Ctrl+Alt+C / Cmd+Option+C)
3. See detailed logs:
   - Request headers
   - Request body
   - Response headers
   - Response body
   - Errors

---

## Common Issues & Solutions

### ❌ "Cannot GET /"
- **Problem**: Server not running
- **Solution**: 
  ```powershell
  cd backend
  npm start
  ```

### ❌ "Connection refused"
- **Problem**: Wrong port or server crashed
- **Solution**: 
  - Check server is running
  - Verify port is 3400
  - Check terminal for errors

### ❌ "Invalid ID"
- **Problem**: Using wrong/empty ID variables
- **Solution**:
  - Run "Create" request first
  - Copy ID from response
  - Update environment variable
  - Try again

### ❌ "404 Not Found"
- **Problem**: Resource doesn't exist or wrong path
- **Solution**:
  - Verify URL is correct
  - Check spelling (case-sensitive)
  - Ensure resource was created

### ❌ "500 Internal Server Error"
- **Problem**: Backend error
- **Solution**:
  - Check server terminal logs
  - Verify request body format
  - Ensure database is connected

---

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `baseUrl` | API base address | `http://localhost:3400` |
| `bearerToken` | JWT auth token | (set after login) |
| `userId` | Created user ID | (from Create User response) |
| `productId` | Created product ID | (from Create Product response) |
| `orderId` | Created order ID | (from Create Order response) |
| `conversationId` | Chat conversation | `conv-demo-123` |
| `notificationId` | Notification ID | (from Create Notification) |

---

## Advanced: Writing Tests

### Add Tests to Verify Responses:

1. Click any request
2. Go to **Tests** tab
3. Add script:

```javascript
// Test 1: Check status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test 2: Check response structure
pm.test("Response has required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('_id');
    pm.expect(jsonData).to.have.property('name');
});

// Test 3: Save ID to environment
pm.test("Save ID to environment", function () {
    var jsonData = pm.response.json();
    pm.environment.set("userId", jsonData._id);
});
```

4. Click **Send** - tests run automatically ✓

---

## API Response Examples

### Success Response (200/201)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-12-03T10:30:00Z"
}
```

### Error Response (400)
```json
{
  "error": "Invalid email format",
  "status": 400
}
```

### Error Response (404)
```json
{
  "error": "User not found",
  "status": 404
}
```

---

## Quick Reference Commands

### Via Terminal:
```bash
# Health check
curl http://localhost:3400/

# Get all users
curl http://localhost:3400/user

# Get specific user
curl http://localhost:3400/user/USER_ID

# Create user
curl -X POST http://localhost:3400/user \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass","name":"Test"}'
```

---

## Success Checklist ✅

- [ ] Backend server running
- [ ] Health check returns 200
- [ ] Can create user
- [ ] Can create product
- [ ] Can create order
- [ ] Can send notification
- [ ] Can send chat message
- [ ] All IDs populate in environment
- [ ] Collection runs without errors

**You're ready to test! 🚀**
