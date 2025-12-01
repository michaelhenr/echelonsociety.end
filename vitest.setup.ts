import '@testing-library/jest-dom'

// Mock Supabase client used in frontend tests
import { vi } from 'vitest'

vi.mock('@/integrations/supabase/client', () => ({
	supabase: {
		from: () => ({ select: async () => ({ data: [], error: null }) }),
		auth: {
			getUser: async () => ({ data: { user: null } })
		},
		functions: {
			invoke: vi.fn(async () => ({ data: { reply: 'mocked' } }))
		}
	}
}))
