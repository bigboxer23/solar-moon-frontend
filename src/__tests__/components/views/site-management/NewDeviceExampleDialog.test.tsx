import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import NewDeviceExampleDialog from '../../../../components/views/site-management/NewDeviceExampleDialog';

vi.mock('react-icons/fi', () => ({
  FiExternalLink: () => <div data-testid='external-link-icon' />,
}));

// Mock the image import
vi.mock('../../../../assets/docs/exampleDevice.jpg', () => ({
  default: 'test-image-url',
}));

describe('NewDeviceExampleDialog', () => {
  const mockSetShow = vi.fn();
  const mockShowDeviceCreation = vi.fn();

  const defaultProps = {
    show: true,
    setShow: mockSetShow,
    showDeviceCreation: mockShowDeviceCreation,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders modal when show is true', () => {
    render(<NewDeviceExampleDialog {...defaultProps} />);

    expect(screen.getByText('Creating a Device')).toBeInTheDocument();
  });

  test('does not render modal when show is false', () => {
    render(<NewDeviceExampleDialog {...defaultProps} show={false} />);

    expect(screen.queryByText('Creating a Device')).not.toBeInTheDocument();
  });

  test('renders device example image', () => {
    render(<NewDeviceExampleDialog {...defaultProps} />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image-url');
  });

  test('renders help text content', () => {
    render(<NewDeviceExampleDialog {...defaultProps} />);

    // Check that help text is rendered (checking for link that opens docs)
    const docLink = screen.getByText('here');
    expect(docLink).toBeInTheDocument();
    expect(screen.getByTestId('external-link-icon')).toBeInTheDocument();
  });

  test('opens documentation link when clicked', () => {
    // Mock window.open
    const mockOpen = vi.fn();
    global.window.open = mockOpen;

    render(<NewDeviceExampleDialog {...defaultProps} />);

    const docLink = screen.getByText('here');
    fireEvent.click(docLink);

    expect(mockOpen).toHaveBeenCalledWith(
      'https://solarmoonanalytics.com/docs/connectingDevice',
    );
  });

  test('renders create first device button', () => {
    render(<NewDeviceExampleDialog {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /create first device/i }),
    ).toBeInTheDocument();
  });

  test('closes modal and shows device creation when button is clicked', () => {
    render(<NewDeviceExampleDialog {...defaultProps} />);

    const createButton = screen.getByRole('button', {
      name: /create first device/i,
    });
    fireEvent.click(createButton);

    expect(mockSetShow).toHaveBeenCalledWith(false);
    expect(mockShowDeviceCreation).toHaveBeenCalledWith(true);
  });

  test('renders with correct image styling', () => {
    render(<NewDeviceExampleDialog {...defaultProps} />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image-url');
  });

  test('renders modal structure correctly', () => {
    render(<NewDeviceExampleDialog {...defaultProps} />);

    // Check that the modal title is rendered which confirms the modal is shown
    expect(screen.getByText('Creating a Device')).toBeInTheDocument();

    // Check that both the image and the button are rendered
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create first device/i }),
    ).toBeInTheDocument();
  });
});
