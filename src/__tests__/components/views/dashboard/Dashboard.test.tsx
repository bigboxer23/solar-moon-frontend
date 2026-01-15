import { render, screen } from '@testing-library/react';
import type { Dispatch, ReactElement, SetStateAction } from 'react';
import { vi } from 'vitest';

import Dashboard from '../../../../components/views/dashboard/Dashboard';
import { useStickyState } from '../../../../utils/Utils';

interface OverviewProps {
  setTrialDate?: Dispatch<SetStateAction<Date | null>>;
}

// Mock utils
vi.mock('../../../../utils/Utils', () => ({
  useStickyState: vi.fn(),
}));

// Mock Overview component
vi.mock('../../../../components/views/dashboard/Overview', () => {
  const MockOverview = function ({
    setTrialDate,
  }: OverviewProps): ReactElement {
    return (
      <div data-set-trial-date={!!setTrialDate} data-testid='overview'>
        Overview Component
      </div>
    );
  };
  return { default: MockOverview };
});

// Mock window.location
delete (window as { location?: unknown }).location;
(window as { location: { href: string } }).location = { href: '' };

describe('Dashboard', () => {
  const mockSetTrialDate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.location.href = '';

    // Reset environment variable
    delete process.env.VITE_ACCESS_CODE;

    // Default mock: no unlock code stored
    useStickyState.mockReturnValue([null, vi.fn()]);
  });

  afterEach(() => {
    // Clean up environment variable
    delete process.env.VITE_ACCESS_CODE;
  });

  test('renders main container with correct CSS classes', () => {
    const { container } = render(<Dashboard setTrialDate={mockSetTrialDate} />);

    const main = container.querySelector('main');
    expect(main).toHaveClass('Home2', 'flex', 'flex-col', 'items-center');
  });

  test('renders Overview component and passes setTrialDate prop', () => {
    render(<Dashboard setTrialDate={mockSetTrialDate} />);

    const overview = screen.getByTestId('overview');
    expect(overview).toBeInTheDocument();
    expect(overview).toHaveAttribute('data-set-trial-date', 'true');
  });

  test('does not redirect when no access code is required', () => {
    // No REACT_APP_ACCESS_CODE environment variable
    useStickyState.mockReturnValue([null, vi.fn()]);

    render(<Dashboard setTrialDate={mockSetTrialDate} />);

    expect(window.location.href).toBe('');
    expect(screen.getByTestId('overview')).toBeInTheDocument();
  });

  test('does not redirect when access code matches unlocked code', () => {
    process.env.VITE_ACCESS_CODE = 'secret123';
    useStickyState.mockReturnValue(['secret123', vi.fn()]);

    render(<Dashboard setTrialDate={mockSetTrialDate} />);

    expect(window.location.href).toBe('');
    expect(screen.getByTestId('overview')).toBeInTheDocument();
  });

  test('redirects to /lock when access code is required but not unlocked', () => {
    process.env.VITE_ACCESS_CODE = 'secret123';
    useStickyState.mockReturnValue([null, vi.fn()]);

    render(<Dashboard setTrialDate={mockSetTrialDate} />);

    expect(window.location.href).toBe('/lock');
  });

  test('redirects to /lock when access code does not match unlocked code', () => {
    process.env.VITE_ACCESS_CODE = 'secret123';
    useStickyState.mockReturnValue(['wrongcode', vi.fn()]);

    render(<Dashboard setTrialDate={mockSetTrialDate} />);

    expect(window.location.href).toBe('/lock');
  });

  test('calls useStickyState with correct parameters', () => {
    render(<Dashboard setTrialDate={mockSetTrialDate} />);

    expect(useStickyState).toHaveBeenCalledWith(null, 'unlock.code');
  });

  test('handles empty string access code', () => {
    process.env.VITE_ACCESS_CODE = '';
    useStickyState.mockReturnValue([null, vi.fn()]);

    render(<Dashboard setTrialDate={mockSetTrialDate} />);

    expect(window.location.href).toBe('');
    expect(screen.getByTestId('overview')).toBeInTheDocument();
  });

  test('handles undefined setTrialDate prop', () => {
    render(<Dashboard />);

    const overview = screen.getByTestId('overview');
    expect(overview).toBeInTheDocument();
    expect(overview).toHaveAttribute('data-set-trial-date', 'false');
  });

  test('redirect logic runs on component mount', () => {
    const originalHref = window.location.href;
    process.env.VITE_ACCESS_CODE = 'test123';
    useStickyState.mockReturnValue([null, vi.fn()]);

    render(<Dashboard setTrialDate={mockSetTrialDate} />);

    // Should have changed from original
    expect(window.location.href).not.toBe(originalHref);
    expect(window.location.href).toBe('/lock');
  });

  test('component still renders even when redirecting', () => {
    process.env.VITE_ACCESS_CODE = 'test123';
    useStickyState.mockReturnValue([null, vi.fn()]);

    const { container } = render(<Dashboard setTrialDate={mockSetTrialDate} />);

    // Component structure should still be in DOM even if redirecting
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(screen.getByTestId('overview')).toBeInTheDocument();
  });

  test('handles special characters in access code', () => {
    const specialCode = 'test@#$%^&*()';
    process.env.VITE_ACCESS_CODE = specialCode;
    useStickyState.mockReturnValue([specialCode, vi.fn()]);

    render(<Dashboard setTrialDate={mockSetTrialDate} />);

    expect(window.location.href).toBe('');
    expect(screen.getByTestId('overview')).toBeInTheDocument();
  });

  test('case sensitivity in access code comparison', () => {
    process.env.VITE_ACCESS_CODE = 'Secret123';
    useStickyState.mockReturnValue(['secret123', vi.fn()]);

    render(<Dashboard setTrialDate={mockSetTrialDate} />);

    // Should redirect because case doesn't match
    expect(window.location.href).toBe('/lock');
  });
});
