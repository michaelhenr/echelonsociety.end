import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '@/pages/Home'

describe('Home page', () => {
  it('renders hero text and CTA', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    expect(screen.getByText('Echelon Society')).toBeInTheDocument()
    expect(screen.getByText('A Higher Standard')).toBeInTheDocument()
    expect(screen.getByText('Explore Our Collection')).toBeInTheDocument()
  })
})
