import { jest } from '@jest/globals'

// Mock the Notification model before importing
const mockSave = jest.fn()
const mockNotificationConstructor = jest.fn(function(data) {
  this.type = data.type
  this.title = data.title
  this.message = data.message
  this.read = data.read || false
  this.active = data.active !== undefined ? data.active : true
  this.save = mockSave
  return this
})

jest.unstable_mockModule('../../Models/Notification.js', () => ({
  __esModule: true,
  default: mockNotificationConstructor
}))

const { createNotification } = await import('../../helpers/createNotification.js')

describe('createNotification Helper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Suppress console.log and console.error in tests
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('should create notification with valid data', async () => {
    mockSave.mockResolvedValueOnce(true)
    mockNotificationConstructor.mockReturnValueOnce({
      type: 'product',
      title: 'Test Title',
      message: 'Test Message',
      read: false,
      active: true,
      save: mockSave
    })

    const result = await createNotification('product', 'Test Title', 'Test Message')

    expect(mockNotificationConstructor).toHaveBeenCalledWith({
      type: 'product',
      title: 'Test Title',
      message: 'Test Message',
      read: false,
      active: true
    })
    expect(mockSave).toHaveBeenCalled()
    expect(result).toBeTruthy()
  })

  test('should set read to false by default', async () => {
    mockSave.mockResolvedValueOnce(true)
    mockNotificationConstructor.mockReturnValueOnce({
      save: mockSave
    })

    await createNotification('order', 'Order Title', 'Order Message')

    expect(mockNotificationConstructor).toHaveBeenCalledWith(
      expect.objectContaining({
        read: false
      })
    )
  })

  test('should set active to true by default', async () => {
    mockSave.mockResolvedValueOnce(true)
    mockNotificationConstructor.mockReturnValueOnce({
      save: mockSave
    })

    await createNotification('brand', 'Brand Title', 'Brand Message')

    expect(mockNotificationConstructor).toHaveBeenCalledWith(
      expect.objectContaining({
        active: true
      })
    )
  })

  test('should handle different notification types', async () => {
    const types = ['order', 'ad', 'brand', 'product']
    mockSave.mockResolvedValue(true)
    mockNotificationConstructor.mockReturnValue({
      save: mockSave
    })

    for (const type of types) {
      await createNotification(type, `${type} Title`, `${type} Message`)
      expect(mockNotificationConstructor).toHaveBeenCalledWith(
        expect.objectContaining({ type })
      )
    }
  })

  test('should return null on error and not throw', async () => {
    mockSave.mockRejectedValueOnce(new Error('Database error'))
    mockNotificationConstructor.mockReturnValueOnce({
      save: mockSave
    })

    const result = await createNotification('product', 'Title', 'Message')

    expect(result).toBeNull()
    expect(console.error).toHaveBeenCalled()
  })

  test('should log success message when notification is created', async () => {
    mockSave.mockResolvedValueOnce(true)
    mockNotificationConstructor.mockReturnValueOnce({
      save: mockSave
    })

    await createNotification('product', 'Test Title', 'Test Message')

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('✅ Notification created: product - Test Title')
    )
  })
})

