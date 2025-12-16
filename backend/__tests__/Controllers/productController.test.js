import { jest } from '@jest/globals'

// Mock the Product model
const mockFind = jest.fn()
const mockFindByIdAndUpdate = jest.fn()
const mockFindByIdAndDelete = jest.fn()

jest.unstable_mockModule('../../Models/Product.js', () => ({
  __esModule: true,
  default: {
    find: mockFind,
    findByIdAndUpdate: mockFindByIdAndUpdate,
    findByIdAndDelete: mockFindByIdAndDelete
  }
}))

// Mock createNotification helper
jest.unstable_mockModule('../../helpers/createNotification.js', () => ({
  createNotification: jest.fn().mockResolvedValue(true)
}))

const Product = (await import('../../Models/Product.js')).default
const { listProducts, createProduct, approveProduct, rejectProduct } = await import('../../Controllers/productController.js')

describe('Product Controller', () => {
  let req, res

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: null
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }
    jest.clearAllMocks()
    // Suppress console.error in tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('listProducts', () => {
    test('should return approved products for regular users', async () => {
      const mockProducts = [
        { _id: '1', name: 'Product 1', status: 'approved' },
        { _id: '2', name: 'Product 2', status: 'approved' }
      ]

      const mockPopulate = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockProducts)
      })

      mockFind.mockReturnValue({
        populate: mockPopulate
      })

      req.user = null // Regular user

      await listProducts(req, res)

      expect(mockFind).toHaveBeenCalledWith({ status: 'approved' })
      expect(res.json).toHaveBeenCalledWith(mockProducts)
    })

    test('should return all products for admin users', async () => {
      const mockProducts = [
        { _id: '1', name: 'Product 1', status: 'approved' },
        { _id: '2', name: 'Product 2', status: 'pending' }
      ]

      const mockPopulate = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockProducts)
      })

      mockFind.mockReturnValue({
        populate: mockPopulate
      })

      req.user = { role: 'admin' }

      await listProducts(req, res)

      expect(mockFind).toHaveBeenCalledWith({})
      expect(res.json).toHaveBeenCalledWith(mockProducts)
    })

    test('should handle errors gracefully', async () => {
      const mockPopulate = jest.fn().mockReturnValue({
        lean: jest.fn().mockRejectedValue(new Error('Database error'))
      })

      mockFind.mockReturnValue({
        populate: mockPopulate
      })

      await listProducts(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unable to fetch products' })
    })
  })

  describe('createProduct', () => {
    test('should reject product without image_url', async () => {
      req.body = {
        name: 'Test Product',
        price: 100
        // Missing image_url - should fail validation
      }

      await createProduct(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Image URL is required' })
    })
  })

  describe('approveProduct', () => {
    test('should approve product and update status', async () => {
      const mockProduct = {
        _id: '123',
        name: 'Test Product',
        status: 'approved'
      }

      mockFindByIdAndUpdate.mockResolvedValue(mockProduct)
      req.params.id = '123'

      await approveProduct(req, res)

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        expect.objectContaining({ status: 'approved' }),
        { new: true }
      )
      expect(res.json).toHaveBeenCalledWith(mockProduct)
    })

    test('should return 404 if product not found', async () => {
      mockFindByIdAndUpdate.mockResolvedValue(null)
      req.params.id = 'invalid-id'

      await approveProduct(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' })
    })

    test('should handle errors', async () => {
      mockFindByIdAndUpdate.mockRejectedValue(new Error('Database error'))
      req.params.id = '123'

      await approveProduct(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unable to approve product' })
    })
  })

  describe('rejectProduct', () => {
    test('should reject product and update status', async () => {
      const mockProduct = {
        _id: '123',
        name: 'Test Product',
        status: 'rejected'
      }

      mockFindByIdAndUpdate.mockResolvedValue(mockProduct)
      req.params.id = '123'

      await rejectProduct(req, res)

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        expect.objectContaining({ status: 'rejected' }),
        { new: true }
      )
      expect(res.json).toHaveBeenCalledWith(mockProduct)
    })

    test('should return 404 if product not found', async () => {
      mockFindByIdAndUpdate.mockResolvedValue(null)
      req.params.id = 'invalid-id'

      await rejectProduct(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' })
    })
  })
})
