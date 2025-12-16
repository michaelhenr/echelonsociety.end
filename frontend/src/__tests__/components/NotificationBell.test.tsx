import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NotificationBell } from '../../components/NotificationBell'
import * as api from '../../lib/api'
import { useToast } from '../../hooks/use-toast'

// Mock the API module
vi.mock('../../lib/api', () => ({
  default: {
    fetchNotifications: vi.fn(),
    getUnreadNotificationCount: vi.fn(),
    markNotificationAsRead: vi.fn(),
    markAllNotificationsAsRead: vi.fn()
  },
  fetchNotifications: vi.fn(),
  getUnreadNotificationCount: vi.fn(),
  markNotificationAsRead: vi.fn(),
  markAllNotificationsAsRead: vi.fn()
}))

// Mock useToast hook
vi.mock('../../hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn()
  }))
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Bell: () => <div data-testid="bell-icon">🔔</div>
}))

describe('NotificationBell Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(api.fetchNotifications as any).mockResolvedValue([])
    ;(api.getUnreadNotificationCount as any).mockResolvedValue({ count: 0 })
  })

  it('should render bell icon', () => {
    render(<NotificationBell />)
    expect(screen.getByTestId('bell-icon')).toBeInTheDocument()
  })

  it('should show unread count badge when there are unread notifications', async () => {
    ;(api.getUnreadNotificationCount as any).mockResolvedValue({ count: 5 })

    render(<NotificationBell />)

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  it('should show "9+" when unread count is greater than 9', async () => {
    ;(api.getUnreadNotificationCount as any).mockResolvedValue({ count: 15 })

    render(<NotificationBell />)

    await waitFor(() => {
      expect(screen.getByText('9+')).toBeInTheDocument()
    })
  })

  it('should not show badge when there are no unread notifications', async () => {
    ;(api.getUnreadNotificationCount as any).mockResolvedValue({ count: 0 })

    render(<NotificationBell />)

    await waitFor(() => {
      const badge = screen.queryByText('0')
      expect(badge).not.toBeInTheDocument()
    })
  })

  it('should fetch notifications when popover is opened', async () => {
    const mockNotifications = [
      {
        _id: '1',
        type: 'order',
        title: 'New Order',
        message: 'A new order has been placed',
        read: false,
        created_at: new Date().toISOString()
      }
    ]

    ;(api.fetchNotifications as any).mockResolvedValue(mockNotifications)

    render(<NotificationBell />)

    const button = screen.getByRole('button')
    await userEvent.click(button)

    await waitFor(() => {
      expect(api.fetchNotifications).toHaveBeenCalled()
    })
  })

  it('should display notifications in popover', async () => {
    const mockNotifications = [
      {
        _id: '1',
        type: 'order',
        title: 'New Order',
        message: 'A new order has been placed',
        read: false,
        created_at: new Date().toISOString()
      },
      {
        _id: '2',
        type: 'product',
        title: 'New Product',
        message: 'A new product has been submitted',
        read: true,
        created_at: new Date().toISOString()
      }
    ]

    ;(api.fetchNotifications as any).mockResolvedValue(mockNotifications)

    render(<NotificationBell />)

    const button = screen.getByRole('button')
    await userEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('New Order')).toBeInTheDocument()
      expect(screen.getByText('A new order has been placed')).toBeInTheDocument()
      expect(screen.getByText('New Product')).toBeInTheDocument()
    })
  })

  it('should show "No notifications" when there are no notifications', async () => {
    ;(api.fetchNotifications as any).mockResolvedValue([])

    render(<NotificationBell />)

    const button = screen.getByRole('button')
    await userEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('No notifications')).toBeInTheDocument()
    })
  })

  it('should mark notification as read when clicked', async () => {
    const mockNotifications = [
      {
        _id: '1',
        type: 'order',
        title: 'New Order',
        message: 'A new order has been placed',
        read: false,
        created_at: new Date().toISOString()
      }
    ]

    ;(api.fetchNotifications as any).mockResolvedValue(mockNotifications)
    ;(api.markNotificationAsRead as any).mockResolvedValue({ ...mockNotifications[0], read: true })

    render(<NotificationBell />)

    const button = screen.getByRole('button')
    await userEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('New Order')).toBeInTheDocument()
    })

    const notification = screen.getByText('New Order').closest('div')
    if (notification) {
      await userEvent.click(notification)
      await waitFor(() => {
        expect(api.markNotificationAsRead).toHaveBeenCalledWith('1')
      })
    }
  })

  it('should show "Mark all as read" button when there are unread notifications', async () => {
    const mockNotifications = [
      {
        _id: '1',
        type: 'order',
        title: 'New Order',
        message: 'A new order has been placed',
        read: false,
        created_at: new Date().toISOString()
      }
    ]

    ;(api.fetchNotifications as any).mockResolvedValue(mockNotifications)
    ;(api.getUnreadNotificationCount as any).mockResolvedValue({ count: 1 })

    render(<NotificationBell />)

    const button = screen.getByRole('button')
    await userEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Mark all as read')).toBeInTheDocument()
    })
  })
})

