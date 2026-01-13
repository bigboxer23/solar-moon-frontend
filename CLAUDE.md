# Claude Code Project Guide

## Project Overview

React frontend for solar monitoring application with AWS Amplify authentication, data visualization, and device management capabilities.

## Key Technologies

- **TypeScript 5.9** with strict mode enabled
- **React 19** with functional components and hooks
- **AWS Amplify** for authentication and API
- **React Router v6** for navigation
- **Tailwind CSS** for styling
- **Jest + React Testing Library** for testing
- **Chart.js/Recharts** for data visualization
- **ESLint 9 + Prettier** for code quality

## Project Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   ├── nav/             # Navigation components (HeaderBar, Navbar, ProfileMenu)
│   ├── views/           # Page-level components
│   │   ├── dashboard/   # Dashboard and overview
│   │   ├── reports/     # Reporting functionality
│   │   ├── alerts/      # Alert management
│   │   ├── site-details/# Site-specific views
│   │   └── site-management/ # Site and device management
│   └── device-block/    # Device-specific components
├── services/            # API clients and business logic
├── utils/              # Utility functions and helpers
└── __tests__/          # Test files (mirrors src structure)
```

## TypeScript Configuration

### Strict Mode

The project uses TypeScript with comprehensive strict checking:

- All strict flags enabled (`strict: true`)
- `noUncheckedIndexedAccess` for array/object safety
- `noImplicitReturns` for exhaustive function returns
- `noFallthroughCasesInSwitch` for switch statement safety

### Type Patterns

#### Component Props

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}
```

#### API Functions

```typescript
export function getDevices(): Promise<AxiosResponse<Device[]>> {
  return api.get<Device[]>('devices');
}
```

#### Custom Hooks

```typescript
export function useStickyState<T>(
  defaultValue: T,
  key: string,
): [T, Dispatch<SetStateAction<T>>];
```

#### State Setters as Props

```typescript
interface ComponentProps {
  setData?: Dispatch<SetStateAction<DataType>>;
}

// Use optional chaining when calling
setData?.(newValue);
```

### Type Safety Guidelines

- Use explicit types for component props and function parameters
- Avoid `any` except for Chart.js compatibility (documented in code)
- Use type guards for union types
- Prefer interfaces over types for object shapes
- Use non-null assertions (`!`) only after explicit filtering/checks
- Provide fallback values with nullish coalescing (`??`)

## Development Commands

```bash
# Start development server
npm start

# Run tests
npm test -- --watchAll=false
npm test -- --watchAll=false --coverage  # With coverage
npm test -- --watchAll=false --testPathPattern=ComponentName  # Specific tests

# Linting and formatting
npm run lint
npm run format

# Build for production
npm run build
```

## Testing Patterns

### Component Testing

- Use `render()` from React Testing Library
- Mock external dependencies (AWS Amplify, external libraries)
- Test user interactions with `fireEvent`
- Use `screen.getByRole()`, `screen.getByText()`, etc. for queries
- Test accessibility with proper aria attributes

### Navigation Testing

```typescript
const renderWithRouter = (component: React.ReactElement, initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>{component}</MemoryRouter>,
  );
};
```

### Common Mocks

```typescript
// AWS Amplify
jest.mock('@aws-amplify/auth', () => ({
  fetchUserAttributes: jest.fn(),
}));

jest.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: jest.fn(),
}));

// Type-safe mock functions
import { jest } from '@jest/globals';
const mockFn = jest.fn() as jest.MockedFunction<typeof originalFunction>;
```

### TypeScript in Tests

- Use `.tsx` extension for test files with JSX
- Type mock functions properly: `jest.fn() as jest.MockedFunction<typeof fn>`
- Prefix unused destructured variables with `_` (e.g., `const { container: _container }`)
- Use `@ts-expect-error` for intentional type mismatches in test mocks

## Code Style Guidelines

- Use functional components with hooks
- Prefer `const` declarations
- Use array destructuring (`const [first] = array`) instead of index access
- Define explicit TypeScript interfaces for all component props
- Use optional chaining (`?.`) for optional callbacks and properties
- Prefix unused variables with underscore (`_variable`)
- Follow existing component patterns for props and state management
- Use Tailwind CSS classes consistently
- Keep components focused and testable
- Avoid `any` type except where documented (Chart.js compatibility)

## Authentication Flow

- Uses AWS Amplify Authenticator
- Profile management through ProfileMenu component
- Trial period tracking with `getDaysLeftInTrial()`
- Sign out functionality integrated in navigation

## Navigation Structure

- Desktop: Horizontal navigation with ProfileMenu dropdown
- Mobile: Hamburger menu with slide-out navigation
- Active route highlighting with border styling
- Responsive design with `sm:` prefixes

## Data Visualization

- Chart components for power generation data
- Weather integration for solar forecasting
- Device status monitoring and alerts
- Report generation and export functionality

## State Management

- Uses React hooks (useState, useEffect, custom hooks)
- `useStickyState` for persistent preferences
- Context-based theme switching
- Local component state for UI interactions

## Key Components to Understand

### Navigation Components

- `HeaderBar`: Simple header with logo and title
- `Navbar`: Main navigation with responsive design
- `ProfileMenu`: User profile dropdown with settings

### Common Components

- `Avatar`: User profile image with fallback
- `Button`: Styled button variants
- `Modal`: Overlay dialogs
- `ThemeSelector`: Dark/light mode toggle

### View Components

- `Dashboard/Overview`: Main dashboard with charts
- `Reports`: Data export and reporting
- `SiteDetails`: Individual site monitoring
- `SiteManagement`: Site and device configuration

## Testing Strategy

- Aim for high test coverage (90%+)
- Test component rendering, props, user interactions
- Mock external dependencies appropriately
- Use descriptive test names and group related tests
- Test both happy path and edge cases

## Common Issues

- React Router future flag warnings (expected in tests)
- ESLint prefer-destructuring rule (use array destructuring)
- Icon rendering in tests (use SVG selectors instead of class names)
- Mock persistence between tests (reset in beforeEach)
- TypeScript errors in tests: Ensure mock functions are properly typed
- Chart.js type compatibility: Use `as any` with documentation comment
- Unused variable errors: Prefix with `_` to satisfy ESLint rules

## Performance Considerations

- Lazy load route components where appropriate
- Optimize chart rendering for large datasets
- Use React.memo for expensive components
- Implement proper loading states for async operations

## Deployment

- Builds to static files for CDN deployment
- Environment variables for API endpoints
- AWS Amplify hosting integration
