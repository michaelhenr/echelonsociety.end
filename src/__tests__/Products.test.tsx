import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Products from '@/pages/Products'

describe('Products page', () => {
  it('renders products headline', () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    )

    expect(screen.getByText('Featured Collection')).toBeInTheDocument()
  })
})
