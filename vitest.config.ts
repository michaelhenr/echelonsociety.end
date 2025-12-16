import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Only run our core frontend test modules
    include: [
      'frontend/src/__tests__/lib/**/*.test.{ts,tsx}',
      'frontend/src/__tests__/components/NotificationBell.test.tsx',
      'frontend/src/__tests__/pages/Products.test.tsx'
    ],
    exclude: [
      'node_modules',
      'frontend/src/__tests__/components/ui/**',
      'backend/**/*.test.js',
      'backend/__tests__/**/*.test.js'
    ],
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend/src'),
    },
  },
})
