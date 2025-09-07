# Claude Code Project Guide

## Project Overview

React frontend for solar monitoring application with AWS Amplify authentication, data visualization, and device management capabilities.

## Key Technologies

- React 18 with functional components and hooks
- AWS Amplify for authentication and API
- React Router for navigation
- Tailwind CSS for styling
- Jest + React Testing Library for testing
- Chart.js/Recharts for data visualization
- ESLint + Prettier for code quality

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

```javascript
const renderWithRouter = (component, initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>{component}</MemoryRouter>,
  );
};
```

### Common Mocks

```javascript
// AWS Amplify
jest.mock('@aws-amplify/auth', () => ({
  fetchUserAttributes: jest.fn(),
}));

jest.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: jest.fn(),
}));

// External libraries
jest.mock('@szhsin/react-menu', () => ({
  /* mock implementation */
}));
```

## Code Style Guidelines

- Use functional components with hooks
- Prefer `const` declarations
- Use array destructuring (`const [first] = array`) instead of index access
- Follow existing component patterns for props and state management
- Use Tailwind CSS classes consistently
- Keep components focused and testable

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

## Performance Considerations

- Lazy load route components where appropriate
- Optimize chart rendering for large datasets
- Use React.memo for expensive components
- Implement proper loading states for async operations

## Deployment

- Builds to static files for CDN deployment
- Environment variables for API endpoints
- AWS Amplify hosting integration
