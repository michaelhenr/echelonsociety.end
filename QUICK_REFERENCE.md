# Quick Reference Guide - Postman & Programming Paradigms

## 🚀 Quick Postman Test (5 Minutes)

### Start Here:
```
1. Terminal:    npm start (in backend folder)
2. Postman:     Import collection + environment
3. Select:      Environment dropdown → "Echelon Society - Local"
4. Test:        Health Check → GET / → Send
5. Expected:    Status 200, Body: "test"
```

### Full Test Sequence:
```
✓ Health Check (GET /)
  ↓
✓ Create User (POST /user) → Copy ID
  ↓
✓ Set userId in Environment
  ↓
✓ Create Product (POST /product) → Copy ID
  ↓
✓ Create Order (POST /cart with userId + productId)
  ↓
✓ Test Notifications (POST /notifications)
  ↓
✓ Test Chat (POST /chat/message)
```

---

## 📚 Programming Paradigms at a Glance

### Imperative = HOW
```javascript
// Backend Controller - IMPERATIVE
// "Tell me each step"

export async function createUser(req, res) {
  // STEP 1: Extract
  const { email, password } = req.body
  
  // STEP 2: Validate
  if (!email) return res.status(400).json({error: 'Email required'})
  
  // STEP 3: Hash
  const hashed = await bcrypt.hash(password, 10)
  
  // STEP 4: Create
  const user = new User({ email, password: hashed })
  
  // STEP 5: Save
  const saved = await user.save()
  
  // STEP 6: Respond
  res.status(201).json(saved)
}
```

### Declarative = WHAT
```javascript
// Routes - DECLARATIVE
// "What do you want to happen?"

router.post('/signup', createUser)
// Translation: "When POST /signup, run createUser"

// React Component - DECLARATIVE
// "What should render?"

<Route path="/home" element={<Home />} />
// Translation: "At path /home, show Home component"

// Database Model - DECLARATIVE
// "What should data look like?"

const userSchema = new Schema({
  email: { type: String, required: true, unique: true }
})
// Translation: "Users must have unique email"
```

---

## 🎯 Your Project's Pattern Usage

| Component | Type | Reason |
|-----------|------|--------|
| **Routes** | ✅ Declarative | "What routes exist" |
| **Controllers** | ✅ Imperative | "How to process requests" |
| **Models** | ✅ Declarative | "What data structure" |
| **Components** | ✅ Declarative | "What UI to show" |
| **Event Handlers** | ✅ Imperative | "How to respond to events" |

---

## 📖 Common Patterns

### Imperative Pattern Example
```
Problem: User signup
Solution: Do these steps in order
1. Get form data
2. Validate email
3. Hash password
4. Create DB record
5. Generate token
6. Send response
```

### Declarative Pattern Example
```
Problem: Show products page
Solution: Define desired state
Define: "When user goes to /products, show Products component"
Framework handles: How to render, when to load, etc.
```

---

## 🔧 Postman Environment Variables

| Variable | Value | Set By |
|----------|-------|--------|
| `baseUrl` | `http://localhost:3400` | Manual |
| `userId` | (from Create User response `_id`) | Copy after Create User |
| `productId` | (from Create Product response `_id`) | Copy after Create Product |
| `orderId` | (from Create Order response `_id`) | Copy after Create Order |
| `bearerToken` | (from login response) | Copy after Login |

---

## ✅ Testing Checklist

### Before Testing
- [ ] Backend running (`npm start`)
- [ ] Database connected
- [ ] Postman installed
- [ ] Collection imported
- [ ] Environment imported

### During Testing
- [ ] Health check returns 200
- [ ] Create User returns 201
- [ ] Can retrieve user by ID
- [ ] Create Product returns 201
- [ ] Can create order with real IDs
- [ ] Notifications send successfully
- [ ] Chat messages send successfully

### After Testing
- [ ] Check server console for errors
- [ ] Verify data in database
- [ ] Review Postman test results
- [ ] Check response times

---

## 🐛 Quick Troubleshooting

| Error | Solution |
|-------|----------|
| Connection refused | Start backend: `npm start` |
| 404 Not Found | Check URL spelling and capitalization |
| Empty response | Check request body format |
| 500 Error | Look at server console for error details |
| Invalid ID | Run Create request first, copy ID to environment |
| CORS Error | Verify backend has CORS enabled |

---

## 📊 Response Examples

### Success (200/201)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Error (400)
```json
{
  "error": "Email is required"
}
```

### Error (404)
```json
{
  "error": "User not found"
}
```

---

## 💡 Pro Tips

1. **Save IDs Quickly**: 
   - After Create request, response shows `_id`
   - Copy it directly to environment variable
   - Use it in next request with `{{variableName}}`

2. **Chain Requests**:
   - Create → Copy ID → Update → Delete
   - Each uses ID from previous response

3. **Use Console**:
   - Ctrl+Alt+C (Windows) / Cmd+Option+C (Mac)
   - See detailed request/response logs

4. **Test Scripts**:
   - Add validation in Tests tab
   - Auto-save IDs to environment
   - Verify response structure

5. **Run Collection**:
   - Use Runner for automated testing
   - Set delays between requests
   - See all results at once

---

## 🎓 Learning Path

### Level 1: Basic Testing
1. Run health check
2. Create user
3. Get user by ID

### Level 2: Workflow Testing
1. Create user → save ID
2. Create product → save ID
3. Create order (using IDs)

### Level 3: Advanced Testing
1. Write custom tests
2. Auto-extract IDs
3. Chain requests
4. Run full collection

### Level 4: Integration Testing
1. Test all workflows
2. Handle errors
3. Verify database
4. Performance testing

---

## 📝 Paradigm Quick Reference

### When to Use Imperative:
- ✅ Business logic
- ✅ Event handlers
- ✅ Error handling
- ✅ Complex workflows

### When to Use Declarative:
- ✅ UI components
- ✅ Routes/navigation
- ✅ Data schemas
- ✅ Configuration

### Mix Both (Best Practice):
- Routes: Declarative
- Controllers: Imperative
- Models: Declarative
- Components: Declarative
- Handlers: Imperative

---

## 🔗 File References

- **Postman Guide**: `HOW_TO_RUN_POSTMAN.md`
- **Paradigms Explained**: `PROGRAMMING_PARADIGMS.md`
- **API Collection**: `Echelon-Society-API.postman_collection.json`
- **Environment**: `Echelon-Society-Local.postman_environment.json`
- **Postman Setup**: `POSTMAN_SETUP.md`

---

## 🚀 You're Ready!

1. ✅ Backend running
2. ✅ Postman configured
3. ✅ Test cases prepared
4. ✅ Documentation ready
5. ✅ Code patterns understood

**Start testing! 🎉**
