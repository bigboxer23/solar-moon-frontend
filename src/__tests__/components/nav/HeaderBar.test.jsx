/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import React from 'react';

import HeaderBar from '../../../components/nav/HeaderBar';

describe('HeaderBar', () => {
  describe('Basic Rendering', () => {
    test('renders with header text', () => {
      render(<HeaderBar headerText='Test Page' />);

      expect(screen.getByText('Test Page')).toBeInTheDocument();
    });

    test('renders brand logo', () => {
      render(<HeaderBar headerText='Test Page' />);

      const logo = screen.getByAltText('brand');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'logo.svg');
    });

    test('renders without header text when not provided', () => {
      render(<HeaderBar />);

      const logo = screen.getByAltText('brand');
      expect(logo).toBeInTheDocument();

      // Header text area should be empty but still present
      const headerTextElement = document.querySelector('.text-xl.font-bold');
      expect(headerTextElement).toBeInTheDocument();
      expect(headerTextElement).toHaveTextContent('');
    });

    test('renders without leftContent when not provided', () => {
      render(<HeaderBar headerText='Test Page' />);

      const leftContentContainer = document.querySelector(
        '.flex.items-center.justify-center',
      );
      expect(leftContentContainer).toBeInTheDocument();

      // Should only contain the logo
      const logo = leftContentContainer.querySelector('img[alt="brand"]');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    test('displays provided header text correctly', () => {
      const headerText = 'Dashboard Overview';
      render(<HeaderBar headerText={headerText} />);

      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    test('renders left content when provided', () => {
      const leftContent = <button data-testid='back-button'>Back</button>;
      render(<HeaderBar headerText='Test Page' leftContent={leftContent} />);

      expect(screen.getByTestId('back-button')).toBeInTheDocument();
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    test('renders complex left content correctly', () => {
      const leftContent = (
        <div data-testid='complex-left-content'>
          <button>Button 1</button>
          <span>Some Text</span>
          <button>Button 2</button>
        </div>
      );

      render(<HeaderBar headerText='Test Page' leftContent={leftContent} />);

      expect(screen.getByTestId('complex-left-content')).toBeInTheDocument();
      expect(screen.getByText('Button 1')).toBeInTheDocument();
      expect(screen.getByText('Some Text')).toBeInTheDocument();
      expect(screen.getByText('Button 2')).toBeInTheDocument();
    });

    test('handles empty string header text', () => {
      render(<HeaderBar headerText='' />);

      const headerTextElement = document.querySelector('.text-xl.font-bold');
      expect(headerTextElement).toBeInTheDocument();
      expect(headerTextElement).toHaveTextContent('');
    });

    test('handles long header text', () => {
      const longHeaderText =
        'This is a very long header text that might wrap or overflow depending on screen size';
      render(<HeaderBar headerText={longHeaderText} />);

      expect(screen.getByText(longHeaderText)).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('applies correct CSS classes to main container', () => {
      const { container } = render(<HeaderBar headerText='Test Page' />);

      const navbar = container.querySelector('.Navbar');
      expect(navbar).toHaveClass(
        'Navbar',
        'flex',
        'h-[4.5rem]',
        'w-full',
        'items-center',
        'border-b',
        'border-gray-400',
        'dark:border-0',
        'sm:h-[6.25rem]',
      );
    });

    test('applies correct classes to left content container', () => {
      render(<HeaderBar headerText='Test Page' />);

      const leftContainer = document.querySelector(
        '.flex.items-center.justify-center',
      );
      expect(leftContainer).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
      );
    });

    test('applies correct classes to logo', () => {
      render(<HeaderBar headerText='Test Page' />);

      const logo = screen.getByAltText('brand');
      expect(logo).toHaveClass('ml-6', 'size-10', 'sm:ml-8', 'sm:size-12');
    });

    test('applies correct classes to header text container', () => {
      render(<HeaderBar headerText='Test Page' />);

      const headerContainer = document.querySelector('.ms-4.flex.items-center');
      expect(headerContainer).toHaveClass('ms-4', 'flex', 'items-center');
    });

    test('applies correct classes to header text span', () => {
      render(<HeaderBar headerText='Test Page' />);

      const headerTextSpan = screen.getByText('Test Page');
      expect(headerTextSpan).toHaveClass(
        'text-xl',
        'font-bold',
        'text-black',
        'dark:text-gray-100',
      );
    });
  });

  describe('Responsive Behavior', () => {
    test('has responsive height classes', () => {
      const { container } = render(<HeaderBar headerText='Test Page' />);

      const navbar = container.querySelector('.Navbar');
      expect(navbar).toHaveClass('h-[4.5rem]', 'sm:h-[6.25rem]');
    });

    test('has responsive logo size classes', () => {
      render(<HeaderBar headerText='Test Page' />);

      const logo = screen.getByAltText('brand');
      expect(logo).toHaveClass('size-10', 'sm:size-12');
      expect(logo).toHaveClass('ml-6', 'sm:ml-8');
    });
  });

  describe('Dark Mode Support', () => {
    test('has dark mode classes for border', () => {
      const { container } = render(<HeaderBar headerText='Test Page' />);

      const navbar = container.querySelector('.Navbar');
      expect(navbar).toHaveClass('border-gray-400', 'dark:border-0');
    });

    test('has dark mode classes for header text', () => {
      render(<HeaderBar headerText='Test Page' />);

      const headerTextSpan = screen.getByText('Test Page');
      expect(headerTextSpan).toHaveClass('text-black', 'dark:text-gray-100');
    });
  });

  describe('Accessibility', () => {
    test('logo has proper alt text', () => {
      render(<HeaderBar headerText='Test Page' />);

      const logo = screen.getByAltText('brand');
      expect(logo).toHaveAttribute('alt', 'brand');
    });

    test('header text is properly structured for screen readers', () => {
      render(<HeaderBar headerText='Important Page Title' />);

      const headerText = screen.getByText('Important Page Title');
      expect(headerText.tagName).toBe('SPAN');

      // Should be prominent for screen readers with proper styling
      expect(headerText).toHaveClass('text-xl', 'font-bold');
    });
  });

  describe('Layout Structure', () => {
    test('maintains proper layout structure with left content and header text', () => {
      const leftContent = <button data-testid='test-button'>Test</button>;
      render(<HeaderBar headerText='Test Page' leftContent={leftContent} />);

      // Should have main container
      const mainContainer = document.querySelector('.Navbar');
      expect(mainContainer).toBeInTheDocument();

      // Should have left section with content and logo
      const leftSection = mainContainer.querySelector(
        '.flex.items-center.justify-center',
      );
      expect(leftSection).toBeInTheDocument();
      expect(leftSection).toContainElement(screen.getByTestId('test-button'));
      expect(leftSection).toContainElement(screen.getByAltText('brand'));

      // Should have header text section
      const headerSection = mainContainer.querySelector(
        '.ms-4.flex.items-center',
      );
      expect(headerSection).toBeInTheDocument();
      expect(headerSection).toContainElement(screen.getByText('Test Page'));
    });

    test('maintains layout structure without left content', () => {
      render(<HeaderBar headerText='Test Page' />);

      const mainContainer = document.querySelector('.Navbar');
      const leftSection = mainContainer.querySelector(
        '.flex.items-center.justify-center',
      );
      const headerSection = mainContainer.querySelector(
        '.ms-4.flex.items-center',
      );

      // Left section should only contain logo
      expect(leftSection.children).toHaveLength(1);
      expect(leftSection).toContainElement(screen.getByAltText('brand'));

      // Header section should contain header text
      expect(headerSection).toContainElement(screen.getByText('Test Page'));
    });
  });

  describe('Integration', () => {
    test('works with different types of left content', () => {
      const testCases = [
        { content: <button>Button</button>, testId: null, text: 'Button' },
        {
          content: <div data-testid='div-content'>Div Content</div>,
          testId: 'div-content',
          text: 'Div Content',
        },
        {
          content: <span>Span Content</span>,
          testId: null,
          text: 'Span Content',
        },
        {
          content: (
            <a data-testid='link' href='#'>
              Link
            </a>
          ),
          testId: 'link',
          text: 'Link',
        },
      ];

      testCases.forEach(({ content, testId, text }) => {
        const { unmount } = render(
          <HeaderBar headerText='Test' leftContent={content} />,
        );

        if (testId) {
          expect(screen.getByTestId(testId)).toBeInTheDocument();
        }
        expect(screen.getByText(text)).toBeInTheDocument();

        unmount();
      });
    });

    test('works with various header text values', () => {
      const testTexts = [
        'Simple Text',
        'Text with Numbers 123',
        'Text with Special Characters!@#$%',
        '中文字符', // Chinese characters
        'Very Long Text That Might Cause Layout Issues But Should Still Work Fine',
        '123', // Just numbers
      ];

      testTexts.forEach((text) => {
        const { unmount } = render(<HeaderBar headerText={text} />);
        expect(screen.getByText(text)).toBeInTheDocument();
        unmount();
      });
    });
  });
});
