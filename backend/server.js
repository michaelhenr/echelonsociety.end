import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import productsRouter from './Routes/products.js'
import brandsRouter from './Routes/brands.js'
import adsRouter from './Routes/ads.js'
import ordersRouter from './Routes/orders.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.json({ ok: true, message: 'Echelon backend ready' }))

app.use('/api/products', productsRouter)
app.use('/api/brands', brandsRouter)
app.use('/api/ads', adsRouter)
app.use('/api/orders', ordersRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
