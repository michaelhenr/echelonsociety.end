# Postman API Testing Setup

## Overview
This folder contains Postman collection and environment files for testing the Echelon Society API endpoints.

## Files

### 1. `Echelon-Society-API.postman_collection.json`
Complete API collection with all endpoints organized by resource:
- **Health Check** - Server status endpoint
- **User Management** - CRUD operations for users
- **Product Management** - CRUD operations for products
- **Orders** - Order management endpoints
- **Notifications** - Notification system endpoints
- **Chat** - Real-time messaging endpoints

### 2. `Echelon-Society-Local.postman_environment.json`
Local development environment configuration with variables:
- `baseUrl` - API base URL (default: http://localhost:3400)
- `bearerToken` - JWT authentication token
- `userId` - User ID for testing
- `productId` - Product ID for testing
- `orderId` - Order ID for testing
- `conversationId` - Conversation ID for chat testing
- `notificationId` - Notification ID for testing

## Setup Instructions

### Step 1: Import Collection
1. Open Postman
2. Click **Import** button
3. Select **Echelon-Society-API.postman_collection.json**
4. Click **Import**

### Step 2: Import Environment
1. Click **Manage Environments** (gear icon)
2. Click **Import**
3. Select **Echelon-Society-Local.postman_environment.json**
4. Click **Import**

### Step 3: Set Active Environment
1. In top-right, click environment dropdown
2. Select **Echelon Society - Local**
3. Confirm all variables are set correctly

### Step 4: Update Variables (as needed)
1. Edit environment to set actual IDs after creating resources
2. Add bearer token after authentication

## API Endpoints

### Base URL
```
http://localhost:3400
```

### User Management
- `GET /user` - Get all users
- `POST /user` - Create user
- `GET /user/:userId` - Get user by ID
- `PUT /user/:userId` - Update user
- `DELETE /user/:userId` - Delete user

### Product Management
- `GET /product` - Get all products
- `GET /product/:productId` - Get product by ID
- `POST /product` - Create product
- `PUT /product/:productId` - Update product
- `DELETE /product/:productId` - Delete product

### Orders
- `GET /cart` - Get all orders
- `POST /cart` - Create order
- `GET /cart/:orderId` - Get order by ID
- `PUT /cart/:orderId` - Update order status

### Notifications
- `GET /notifications` - Get all notifications
- `POST /notifications` - Create notification
- `PUT /notifications/:notificationId` - Mark as read
- `DELETE /notifications/:notificationId` - Delete notification

### Chat
- `GET /chat` - Get chat sessions
- `POST /chat/message` - Send message
- `GET /chat/history/:conversationId` - Get chat history

## Authentication

### Bearer Token
Most endpoints require authentication. Add the token:
1. Get JWT token from login endpoint
2. Set `bearerToken` environment variable
3. Requests automatically include `Authorization: Bearer {{bearerToken}}` header

## Testing Workflow

### 1. Health Check
```
GET http://localhost:3400/
```
Should return status 200 with "test" message

### 2. User Operations
- Create a user with POST /user
- Store returned userId in environment variable
- Use userId for subsequent requests

### 3. Product Operations
- Retrieve all products with GET /product
- Store productId for order testing

### 4. Order Operations
- Create order with POST /cart using userId and productId
- Store orderId for updates

### 5. Notifications & Chat
- Test real-time features with notifications
- Test messaging with chat endpoints

## Common Issues

### Bearer Token Missing
- **Error**: 401 Unauthorized
- **Solution**: Set `bearerToken` variable in environment

### Base URL Not Found
- **Error**: Connection refused
- **Solution**: Ensure backend server is running on port 3400

### Invalid IDs
- **Error**: 404 Not Found
- **Solution**: Update environment variables with actual resource IDs

### CORS Errors
- **Solution**: Backend has CORS enabled, should work from Postman

## Running Tests

### Collection Runner
1. Click **Runner** button
2. Select collection
3. Select environment
4. Configure iterations and delays
5. Click **Run**

### Pre-request Scripts
Pre-request scripts can auto-populate variables or tokens before requests.

### Tests Tab
Add test scripts to validate responses:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
```

## Environment Files

### Production Environment (Coming Soon)
When deploying to production, create:
- `Echelon-Society-Production.postman_environment.json`
- Update `baseUrl` to production API
- Configure production authentication

## Tips & Best Practices

1. **Use Variables**: Store IDs in environment variables for reusability
2. **Chain Requests**: Use tests to extract IDs and pass to next request
3. **Document Requests**: Add descriptions to each request
4. **Version Control**: Keep collection and environment files in git
5. **Backup**: Export collections regularly

## Support

For API documentation, see `/backend/Routes/` directory for detailed endpoint specifications.

For issues, check:
- Backend server logs
- Browser DevTools (if applicable)
- Postman Console (Ctrl+Alt+C / Cmd+Option+C)
