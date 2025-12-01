import mongoose from 'mongoose'

class MongoConnect {
  static #instance = null

  constructor() {
    if (MongoConnect.#instance) {
      throw new Error('You cannot create multiple instances of MongoConnect. Use MongoConnect.getInstance() instead.')
    }
    MongoConnect.#instance = this
    this.connected = false
  }

  static getInstance() {
    if (!MongoConnect.#instance) MongoConnect.#instance = new MongoConnect()
    return MongoConnect.#instance
  }

  async connect(url) {
    if (this.connected) return mongoose
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    this.connected = true
    return mongoose
  }

  async disconnect() {
    if (!this.connected) return
    await mongoose.disconnect()
    this.connected = false
  }
}

export default MongoConnect
