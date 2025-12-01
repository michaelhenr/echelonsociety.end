import * as model from '../Models/productsModel.js'

export async function listProducts(req, res){
  try{
    const items = await model.getProducts()
    res.json(items)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to fetch products' })
  }
}

export async function createProduct(req, res){
  try{
    const data = await model.createProduct(req.body)
    res.status(201).json(data)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to create product' })
  }
}

export async function removeProduct(req, res){
  try{
    await model.deleteProduct(req.params.id)
    res.json({ success: true })
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to delete product' })
  }
}
