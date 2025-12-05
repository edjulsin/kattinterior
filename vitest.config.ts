import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    define: { "process.env": {} },
    test: {
        projects: [
            {
                extends: true,
                test: {
                    include: [
                        'tests/unit/**/*.{test,spec}.ts',
                        'tests/**/*.unit.{test,spec}.ts'
                    ],
                    name: 'unit',
                    environment: 'node'
                }
            },
            {
                extends: true,
                test: {
                    setupFiles: ['./tests/browser/setup.ts'],
                    include: [
                        'tests/browser/**/*.{test,spec}.{ts,tsx}',
                        'tests/**/*.browser.{test,spec}.{ts,tsx'
                    ],
                    name: 'browser',
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright(),
                        instances: [{ browser: 'chromium' }]
                    }
                }
            }
        ]
    }
})
