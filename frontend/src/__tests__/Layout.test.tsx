import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Layout from '@/components/Layout'

describe('Layout Component', () => {
  it('should render layout component', () => {
    render(<Layout />)
    expect(screen.getByRole('main')).toBeDefined()
  })

  it('should display header', () => {
    render(<Layout />)
    const header = document.querySelector('header')
    expect(header).toBeDefined()
  })

  it('should display footer', () => {
    render(<Layout />)
    const footer = document.querySelector('footer')
    expect(footer).toBeDefined()
  })
})
