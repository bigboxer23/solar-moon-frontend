import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import Appearance from '../../../../components/views/profile/Appearance';

// Mock ThemeSelector component
vi.mock('../../../../components/common/ThemeSelector', () => {
  const MockThemeSelector = function ({ extended }) {
    return (
      <div data-extended={extended.toString()} data-testid='theme-selector'>
        ThemeSelector Component
      </div>
    );
  };
  return { default: MockThemeSelector };
});

describe('Appearance', () => {
  test('renders appearance component with title', () => {
    render(<Appearance />);

    expect(screen.getByText('Appearance')).toBeInTheDocument();
  });

  test('renders ThemeSelector component with extended prop', () => {
    render(<Appearance />);

    const themeSelector = screen.getByTestId('theme-selector');
    expect(themeSelector).toBeInTheDocument();
    expect(themeSelector).toHaveAttribute('data-extended', 'true');
  });

  test('applies correct CSS classes to main container', () => {
    const { container } = render(<Appearance />);

    const mainContainer = container.querySelector('.fade-in');
    expect(mainContainer).toHaveClass(
      'fade-in',
      'my-8',
      'flex',
      'w-[40rem]',
      'max-w-full',
      'flex-col',
      'bg-white',
      'p-6',
      'shadow-panel',
      'dark:bg-gray-800',
      'sm:hidden',
      'sm:rounded-lg',
      'sm:p-8',
    );
  });

  test('applies correct CSS classes to header section', () => {
    const { container } = render(<Appearance />);

    const headerSection = container.querySelector(
      '.mb-8.flex.w-full.justify-between',
    );
    expect(headerSection).toBeInTheDocument();
  });

  test('applies correct CSS classes to title text', () => {
    render(<Appearance />);

    const titleElement = screen.getByText('Appearance');
    expect(titleElement).toHaveClass(
      'text-lg',
      'font-bold',
      'text-black',
      'dark:text-gray-100',
    );
  });

  test('has responsive design with sm:hidden class', () => {
    const { container } = render(<Appearance />);

    const mainContainer = container.querySelector('.fade-in');
    expect(mainContainer).toHaveClass('sm:hidden');
  });

  test('component structure is correct', () => {
    const { container } = render(<Appearance />);

    // Check the overall structure
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('fade-in');

    // Check header structure
    const headerDiv = mainDiv.querySelector('.mb-8');
    expect(headerDiv).toBeInTheDocument();

    const titleSpan = headerDiv.querySelector('span');
    expect(titleSpan).toHaveTextContent('Appearance');

    // Check ThemeSelector is rendered
    const themeSelector = screen.getByTestId('theme-selector');
    expect(themeSelector).toBeInTheDocument();
  });

  test('renders without props (component has no required props)', () => {
    expect(() => render(<Appearance />)).not.toThrow();
  });
});
