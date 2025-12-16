# Database Connection Information

## MongoDB Connection String

**IMPORTANT:** Share this information securely with your team members (via private message, not in public channels).

```
mongodb+srv://abdulrahmanelakkad_db_user:cta5keCnfXP6y7g5@cluster0.j90xhqo.mongodb.net/
```

## How to Share with Team Members

1. **Send the connection string privately** (via Slack DM, email, or secure message)
2. **Tell them to add it to their `backend/.env` file:**
   ```env
   MONGO_URL=mongodb+srv://abdulrahmanelakkad_db_user:cta5keCnfXP6y7g5@cluster0.j90xhqo.mongodb.net/
   ```

## Security Notes

- ⚠️ **Never commit the `.env` file to git**
- ⚠️ **Never share the connection string in public channels**
- ✅ The `.env` file is already in `.gitignore`
- ✅ Team members should copy from `.env.example` and add the actual connection string

## MongoDB Atlas Setup (if needed)

If team members need to be added to the MongoDB Atlas cluster:

1. Go to MongoDB Atlas dashboard
2. Navigate to "Network Access"
3. Add team member IPs or use `0.0.0.0/0` for development (not recommended for production)
4. Navigate to "Database Access" to add users if needed

## Test Accounts

Share these test account credentials with your team:

### Admin Account
- **Email:** `admin@echelon.com`
- **Password:** `admin123`
- **Role:** Admin (can access admin dashboard, approve/reject products, orders, brands, ads)

### Client Account
- **Email:** `client@echelon.com`
- **Password:** `client123`
- **Role:** Client (can browse products, make orders, submit products/brands/ads)

**Note:** These are test accounts. Change passwords in production!

## How to Use These Accounts

1. Start the application (backend and frontend)
2. Go to the sign-in page
3. Enter the email and password above
4. You'll be redirected based on your role:
   - **Admin** → Admin Dashboard
   - **Client** → Home page (can browse products)

