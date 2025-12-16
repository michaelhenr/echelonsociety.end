import dotenv from 'dotenv'
import MongoConnect from '../DB/MongoConnect.js'
import User from '../Models/User.js'
import bcrypt from 'bcryptjs'

dotenv.config()

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/E-Shop'

async function createTestUsers() {
  try {
    console.log('🔗 Connecting to MongoDB...')
    const mongoInstance = MongoConnect.getInstance()
    await mongoInstance.connect(MONGO_URL)
    console.log('✅ Connected to MongoDB\n')

    // Admin user
    const adminEmail = 'admin@echelon.com'
    const adminPassword = 'admin123'
    const adminName = 'Admin User'

    // Client user
    const clientEmail = 'client@echelon.com'
    const clientPassword = 'client123'
    const clientName = 'Client User'

    // Check if users already exist
    const existingAdmin = await User.findOne({ email: adminEmail })
    const existingClient = await User.findOne({ email: clientEmail })

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists, updating...')
      existingAdmin.password = await bcrypt.hash(adminPassword, 10)
      existingAdmin.role = 'admin'
      await existingAdmin.save()
      console.log('✅ Admin user updated')
    } else {
      const adminHash = await bcrypt.hash(adminPassword, 10)
      const admin = new User({
        email: adminEmail,
        password: adminHash,
        name: adminName,
        role: 'admin'
      })
      await admin.save()
      console.log('✅ Admin user created')
    }

    if (existingClient) {
      console.log('⚠️  Client user already exists, updating...')
      existingClient.password = await bcrypt.hash(clientPassword, 10)
      existingClient.role = 'client'
      await existingClient.save()
      console.log('✅ Client user updated')
    } else {
      const clientHash = await bcrypt.hash(clientPassword, 10)
      const client = new User({
        email: clientEmail,
        password: clientHash,
        name: clientName,
        role: 'client'
      })
      await client.save()
      console.log('✅ Client user created')
    }

    console.log('\n' + '='.repeat(60))
    console.log('📧 USER CREDENTIALS')
    console.log('='.repeat(60))
    console.log('\n🔴 ADMIN USER:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log(`   Role: admin`)
    console.log('\n🔵 CLIENT USER:')
    console.log(`   Email: ${clientEmail}`)
    console.log(`   Password: ${clientPassword}`)
    console.log(`   Role: client`)
    console.log('\n' + '='.repeat(60) + '\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createTestUsers()

