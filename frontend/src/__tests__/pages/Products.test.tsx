import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Products from '../../pages/Products'
import api from '../../lib/api'

// Mock the API module
vi.mock('../../lib/api', () => {
  return {
    default: {
      fetchProducts: vi.fn()
    }
  }
})

// Mock useToast hook
const mockToast = vi.fn()
vi.mock('../../hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: mockToast
  }))
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null })
  }
})

// Mock Layout component
vi.mock('../../components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock ProductCard component
vi.mock('../../components/ProductCard', () => ({
  ProductCard: ({ product, onAddToCart }: { product: any, onAddToCart: (id: string) => void }) => (
    <div data-testid={`product-${product._id || product.id}`}>
      <h3>{product.name}</h3>
      <p>{product.price} EGP</p>
      <button onClick={() => onAddToCart(product._id || product.id)}>Add to Cart</button>
    </div>
  )
}))

// Mock image imports
vi.mock('../../assets/bg-logo-5.jpg', () => ({ default: '/mock-bg-logo-5.jpg' }))
vi.mock('../../assets/bg-logo-6.jpg', () => ({ default: '/mock-bg-logo-6.jpg' }))
vi.mock('../../assets/bg-logo-7.jpg', () => ({ default: '/mock-bg-logo-7.jpg' }))

const mockProducts = [
  {
    _id: '1',
    name: 'Product 1',
    description: 'Description 1',
    price: 100,
    category: 'Electronics',
    image_url: 'https://example.com/img1.jpg',
    brand_id: 'brand1',
    brands: { name: 'Brand A' }
  },
  {
    _id: '2',
    name: 'Product 2',
    description: 'Description 2',
    price: 200,
    category: 'Clothing',
    image_url: 'https://example.com/img2.jpg',
    brand_id: 'brand2',
    brands: { name: 'Brand B' }
  }
]

const renderProducts = () => {
  return render(
    <BrowserRouter>
      <Products />
    </BrowserRouter>
  )
}

describe('Products Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(api.fetchProducts as any).mockResolvedValue(mockProducts)
    mockNavigate.mockClear()
    mockToast.mockClear()
  })

  it('should render products page', async () => {
    await act(async () => {
      renderProducts()
    })

    await waitFor(() => {
      expect(screen.getByText('Our Collection')).toBeInTheDocument()
    })
  })

  it('should fetch and display products', async () => {
    await act(async () => {
      renderProducts()
    })

    await waitFor(() => {
      expect(api.fetchProducts).toHaveBeenCalled()
    })
    
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
      expect(screen.getByText('Product 2')).toBeInTheDocument()
    })
  })

  it('should filter products by search term', async () => {
    await act(async () => {
      renderProducts()
    })

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search by product or brand...')
    await act(async () => {
      await userEvent.clear(searchInput)
      await userEvent.type(searchInput, 'Product 1')
    })

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })
  })

  it('should add product to cart', async () => {
    await act(async () => {
      renderProducts()
    })

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })

    const addToCartButtons = screen.getAllByText('Add to Cart')
    await act(async () => {
      await userEvent.click(addToCartButtons[0])
    })

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Added to Cart',
        description: 'Product added successfully'
      })
    })
  })

  it('should show cart count when items are in cart', async () => {
    await act(async () => {
      renderProducts()
    })

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })

    const addToCartButtons = screen.getAllByText('Add to Cart')
    await act(async () => {
      await userEvent.click(addToCartButtons[0])
      await userEvent.click(addToCartButtons[0]) // Add same product twice
    })

    // Check that cart button appears (may need to wait for state update)
    await waitFor(() => {
      const cartButton = screen.queryByText(/View Cart/)
      expect(cartButton).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('should show "No products found" when filtered results are empty', async () => {
    await act(async () => {
      renderProducts()
    })

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search by product or brand...')
    await act(async () => {
      await userEvent.clear(searchInput)
      await userEvent.type(searchInput, 'NonExistentProduct')
    })

    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeInTheDocument()
    })
  })

  it('should handle API errors gracefully', async () => {
    ;(api.fetchProducts as any).mockRejectedValue(new Error('API Error'))
    vi.spyOn(console, 'error').mockImplementation(() => {})

    await act(async () => {
      renderProducts()
    })

    // Component should still render even if API fails
    await waitFor(() => {
      expect(screen.getByText('Our Collection')).toBeInTheDocument()
    })
    expect(api.fetchProducts).toHaveBeenCalled()
  })
})
