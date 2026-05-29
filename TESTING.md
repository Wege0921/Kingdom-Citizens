# Testing Guide

## Setup

Tests use **Vitest** + **@testing-library/react** + **jsdom**.

```bash
npm test          # Run all tests once
npm run test:watch  # Run in watch mode
npm run test:coverage  # Run with coverage report
```

## Test File Structure

Tests live next to the code they test:

```
src/
  lib/
    utils/
      amharic.ts
      amharic.test.ts        # utility tests
    store.ts
    store.test.ts
    validations.ts
    validations.test.ts
  components/
    ui/
      amharic-input.tsx
      amharic-input.test.tsx   # component tests
    sermon/
      share-buttons.tsx
      share-buttons.test.tsx
```

## Mocking Patterns

### Mocking the Zustand store

```ts
let mockLanguage = 'en'
vi.mock('@/lib/store', () => ({
  useAppStore: (selector?: (state: any) => any) => {
    const state = { language: mockLanguage, setLanguage: vi.fn() }
    return selector ? selector(state) : state
  },
}))
```

### Mocking Next.js navigation

Already set up in `src/test/setup.ts`:

```ts
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))
```

### Mocking tRPC

```ts
vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    useUtils: () => ({ invalidate: vi.fn() }),
    myRouter: {
      myProcedure: {
        useQuery: () => ({ data: null, isLoading: false }),
        useMutation: () => ({ mutate: vi.fn(), isPending: false }),
      },
    },
  },
}))
```

### Mocking Supabase

```ts
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getUser: vi.fn(() => Promise.resolve({ data: { user: null } })) },
    from: () => ({
      select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
    }),
  }),
}))
```

## Writing Component Tests

Use `render` from `@testing-library/react`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MyComponent } from './my-component'

it('does something', () => {
  render(<MyComponent prop="value" />)
  expect(screen.getByText('Expected text')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button'))
})
```

For Radix dropdowns/portals, use `within(document.body)`:

```tsx
import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()
await user.click(screen.getByText('Open menu'))
expect(within(document.body).getByText('Menu item')).toBeInTheDocument()
```

## Writing Hook Tests

Use `renderHook` from `@testing-library/react`:

```ts
import { renderHook, act } from '@testing-library/react'
import { useMyHook } from './use-my-hook'

it('updates state', () => {
  const { result } = renderHook(() => useMyHook())
  act(() => { result.current.doSomething() })
  expect(result.current.value).toBe('expected')
})
```

## Coverage

Run `npm run test:coverage` to generate an HTML report in `coverage/`.

Key areas to test:
- **Utilities**: pure functions, validators, helpers
- **Hooks**: state logic, side effects, data fetching
- **UI components**: rendering, interactions, accessibility
- **Forms**: validation, submission, error states
