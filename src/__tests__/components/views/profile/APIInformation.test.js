/* eslint-env jest */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import APIInformation from '../../../../components/views/profile/APIInformation';
import { updateCustomer } from '../../../../services/services';

// Mock dependencies
jest.mock('../../../../services/services', () => ({
  updateCustomer: jest.fn(),
}));

jest.mock('../../../../components/common/CopyButton', () => {
  return function MockCopyButton({ title }) {
    return <button>{title}</button>;
  };
});

jest.mock('../../../../components/common/Button', () => {
  return function MockButton({
    children,
    onClick,
    className,
    id,
    type,
    variant,
    ...props
  }) {
    return (
      <button
        className={`Button-${variant} ${className}`}
        id={id}
        onClick={onClick}
        type={type}
        {...props}
      >
        {children}
      </button>
    );
  };
});

describe('APIInformation', () => {
  const mockCustomerData = {
    id: '123',
    accessKey: 'test-access-key-123',
    email: 'test@example.com',
  };

  const mockSetCustomerData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders API information component with all elements', () => {
    render(
      <APIInformation
        customerData={mockCustomerData}
        setCustomerData={mockSetCustomerData}
      />,
    );

    expect(screen.getByText('API Information')).toBeInTheDocument();
    expect(screen.getByLabelText('Access Key')).toBeInTheDocument();
    expect(screen.getByText('Copy Access Key')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /revoke\/regenerate access key/i }),
    ).toBeInTheDocument();
  });

  test('displays access key in read-only input field', () => {
    render(
      <APIInformation
        customerData={mockCustomerData}
        setCustomerData={mockSetCustomerData}
      />,
    );

    const accessKeyInput = screen.getByLabelText('Access Key');
    expect(accessKeyInput).toHaveValue('test-access-key-123');
    expect(accessKeyInput).toHaveAttribute('readonly');
  });

  test('handles missing access key gracefully', () => {
    const customerWithoutAccessKey = {
      id: '123',
      email: 'test@example.com',
    };

    render(
      <APIInformation
        customerData={customerWithoutAccessKey}
        setCustomerData={mockSetCustomerData}
      />,
    );

    const accessKeyInput = screen.getByLabelText('Access Key');
    expect(accessKeyInput).toHaveValue('');
  });

  test('handles undefined customer data', () => {
    render(
      <APIInformation
        customerData={undefined}
        setCustomerData={mockSetCustomerData}
      />,
    );

    const accessKeyInput = screen.getByLabelText('Access Key');
    expect(accessKeyInput).toHaveValue('');
  });

  test('shows revoke button with delete icon when not loading', () => {
    render(
      <APIInformation
        customerData={mockCustomerData}
        setCustomerData={mockSetCustomerData}
      />,
    );

    const revokeButton = screen.getByRole('button', {
      name: /revoke\/regenerate access key/i,
    });
    expect(revokeButton).toBeInTheDocument();

    // Check for delete icon (SVG)
    const deleteIcon = revokeButton.querySelector('svg');
    expect(deleteIcon).toBeInTheDocument();
  });

  test('opens confirmation dialog when revoke button is clicked', () => {
    render(
      <APIInformation
        customerData={mockCustomerData}
        setCustomerData={mockSetCustomerData}
      />,
    );

    const revokeButton = screen.getByRole('button', {
      name: /revoke\/regenerate access key/i,
    });
    fireEvent.click(revokeButton);

    // Check that confirmation dialog appears
    expect(
      screen.getByText(/are you sure you want to revoke this key/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Revoke Key' }),
    ).toBeInTheDocument();
  });

  test('calls updateCustomer when revoke key is confirmed', async () => {
    updateCustomer.mockResolvedValue({
      data: { ...mockCustomerData, accessKey: '' },
    });

    render(
      <APIInformation
        customerData={mockCustomerData}
        setCustomerData={mockSetCustomerData}
      />,
    );

    // Open confirmation dialog
    const revokeButton = screen.getByRole('button', {
      name: /revoke\/regenerate access key/i,
    });
    fireEvent.click(revokeButton);

    // Click confirm in dialog
    const confirmButton = screen.getByRole('button', { name: 'Revoke Key' });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(updateCustomer).toHaveBeenCalledWith({
        ...mockCustomerData,
        accessKey: '',
      });
    });
  });

  test('updates customer data when updateCustomer succeeds', async () => {
    const updatedCustomerData = { ...mockCustomerData, accessKey: '' };
    updateCustomer.mockResolvedValue({ data: updatedCustomerData });

    render(
      <APIInformation
        customerData={mockCustomerData}
        setCustomerData={mockSetCustomerData}
      />,
    );

    // Open confirmation dialog and confirm
    fireEvent.click(
      screen.getByRole('button', { name: /revoke\/regenerate access key/i }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Revoke Key' }));

    await waitFor(() => {
      expect(mockSetCustomerData).toHaveBeenCalledWith(updatedCustomerData);
    });
  });

  test('shows loading spinner when request is in progress', async () => {
    // Create a promise that we can resolve later
    let resolvePromise;
    const updatePromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    updateCustomer.mockReturnValue(updatePromise);

    render(
      <APIInformation
        customerData={mockCustomerData}
        setCustomerData={mockSetCustomerData}
      />,
    );

    // Open confirmation dialog and confirm
    fireEvent.click(
      screen.getByRole('button', { name: /revoke\/regenerate access key/i }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Revoke Key' }));

    // Should show loading spinner
    await waitFor(() => {
      const revokeButton = screen.getByRole('button', {
        name: /revoke\/regenerate access key/i,
      });
      const spinner = revokeButton.querySelector('.button-icon');
      expect(spinner).toBeInTheDocument();
    });

    // Resolve the promise to complete the test
    resolvePromise({ data: { ...mockCustomerData, accessKey: '' } });
    await waitFor(() => {
      expect(mockSetCustomerData).toHaveBeenCalled();
    });
  });

  test('handles updateCustomer API error gracefully', async () => {
    updateCustomer.mockRejectedValue(new Error('API Error'));

    render(
      <APIInformation
        customerData={mockCustomerData}
        setCustomerData={mockSetCustomerData}
      />,
    );

    // Open confirmation dialog and confirm
    fireEvent.click(
      screen.getByRole('button', { name: /revoke\/regenerate access key/i }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Revoke Key' }));

    await waitFor(() => {
      expect(updateCustomer).toHaveBeenCalled();
    });

    // Customer data should not be updated on error
    expect(mockSetCustomerData).not.toHaveBeenCalled();
  });

  test('applies correct CSS classes and styling', () => {
    const { container } = render(
      <APIInformation
        customerData={mockCustomerData}
        setCustomerData={mockSetCustomerData}
      />,
    );

    const mainContainer = container.querySelector('.fade-in');
    expect(mainContainer).toHaveClass(
      'fade-in',
      'my-8',
      'w-[40rem]',
      'max-w-full',
      'bg-white',
      'p-6',
      'shadow-panel',
      'dark:bg-gray-800',
      'sm:rounded-lg',
      'sm:p-8',
    );
  });

  test('has correct button styling and properties', () => {
    render(
      <APIInformation
        customerData={mockCustomerData}
        setCustomerData={mockSetCustomerData}
      />,
    );

    const revokeButton = screen.getByRole('button', {
      name: /revoke\/regenerate access key/i,
    });

    // The Button component has variant styling and accessibility
    expect(revokeButton).toHaveAttribute('type', 'button');
    expect(revokeButton).toHaveAttribute('id', 'revokeAccessKey');
    expect(revokeButton).toHaveClass('Button-danger');
  });
});
