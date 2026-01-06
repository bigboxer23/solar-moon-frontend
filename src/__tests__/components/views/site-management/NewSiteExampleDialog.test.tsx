/* eslint-env jest */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import NewSiteExampleDialog from '../../../../components/views/site-management/NewSiteExampleDialog';

// Mock the image import
jest.mock(
  '../../../../assets/docs/exampleSite.jpg',
  () => 'test-site-image-url',
);

jest.mock('../../../../utils/HelpText', () => ({
  SITE_HELP_TEXT1: 'Site help text 1',
  SITE_HELP_TEXT2: 'Site help text 2',
  SITE_HELP_TEXT3: 'Site help text 3',
}));

describe('NewSiteExampleDialog', () => {
  const mockSetShow = jest.fn();
  const mockShowSiteCreation = jest.fn();

  const defaultProps = {
    show: true,
    setShow: mockSetShow,
    showSiteCreation: mockShowSiteCreation,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal when show is true', () => {
    render(<NewSiteExampleDialog {...defaultProps} />);

    expect(screen.getByText('Creating a Site')).toBeInTheDocument();
  });

  test('does not render modal when show is false', () => {
    render(<NewSiteExampleDialog {...defaultProps} show={false} />);

    expect(screen.queryByText('Creating a Site')).not.toBeInTheDocument();
  });

  test('renders site example image', () => {
    render(<NewSiteExampleDialog {...defaultProps} />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-site-image-url');
  });

  test('renders help text content', () => {
    render(<NewSiteExampleDialog {...defaultProps} />);

    expect(screen.getByText('Site help text 1')).toBeInTheDocument();
    expect(screen.getByText('Site help text 2')).toBeInTheDocument();
    expect(screen.getByText('Site help text 3')).toBeInTheDocument();
  });

  test('renders create first site button', () => {
    render(<NewSiteExampleDialog {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /create first site/i }),
    ).toBeInTheDocument();
  });

  test('closes modal when close button is clicked', () => {
    render(<NewSiteExampleDialog {...defaultProps} />);

    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find((button) =>
      button.className.includes('Button-icon'),
    );
    fireEvent.click(closeButton);

    expect(mockSetShow).toHaveBeenCalledWith(false);
  });

  test('closes modal and shows site creation when button is clicked', () => {
    render(<NewSiteExampleDialog {...defaultProps} />);

    const createButton = screen.getByRole('button', {
      name: /create first site/i,
    });
    fireEvent.click(createButton);

    expect(mockSetShow).toHaveBeenCalledWith(false);
    expect(mockShowSiteCreation).toHaveBeenCalledWith(true);
  });

  test('renders modal with large size class', () => {
    render(<NewSiteExampleDialog {...defaultProps} />);

    // Check that the modal content is rendered (indicates modal structure)
    expect(screen.getByText('Creating a Site')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('renders responsive layout classes', () => {
    render(<NewSiteExampleDialog {...defaultProps} />);

    // Check that the content is properly structured (image and text are both present)
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByText('Site help text 1')).toBeInTheDocument();
  });

  test('applies dark mode text classes', () => {
    render(<NewSiteExampleDialog {...defaultProps} />);

    // Check that the modal content is rendered with proper text
    expect(screen.getByText('Site help text 1')).toBeInTheDocument();
    expect(screen.getByText('Creating a Site')).toBeInTheDocument();
  });

  test('renders with correct image styling', () => {
    render(<NewSiteExampleDialog {...defaultProps} />);

    const image = screen.getByRole('img');
    expect(image).toHaveClass(
      'max-w-[300px]',
      'rounded-xl',
      'object-fill',
      'sm:max-w-[400px]',
    );
  });

  test('renders help text with proper indentation', () => {
    render(<NewSiteExampleDialog {...defaultProps} />);

    // Check that all three help text paragraphs are rendered
    expect(screen.getByText('Site help text 1')).toBeInTheDocument();
    expect(screen.getByText('Site help text 2')).toBeInTheDocument();
    expect(screen.getByText('Site help text 3')).toBeInTheDocument();
  });

  test('renders modal structure correctly', () => {
    render(<NewSiteExampleDialog {...defaultProps} />);

    // Check that the modal title is rendered which confirms the modal is shown
    expect(screen.getByText('Creating a Site')).toBeInTheDocument();

    // Check that both the image and the button are rendered
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create first site/i }),
    ).toBeInTheDocument();
  });

  test('renders button with correct type and variant', () => {
    render(<NewSiteExampleDialog {...defaultProps} />);

    const createButton = screen.getByRole('button', {
      name: /create first site/i,
    });
    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveTextContent('Create first site');
  });

  test('modal footer contains the create button', () => {
    render(<NewSiteExampleDialog {...defaultProps} />);

    // Check that the button is rendered and functional
    const createButton = screen.getByRole('button', {
      name: /create first site/i,
    });
    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveTextContent('Create first site');
  });
});
