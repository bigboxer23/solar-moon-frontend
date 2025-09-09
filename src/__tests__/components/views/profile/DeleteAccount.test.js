/* eslint-env jest */
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import DeleteAccount from '../../../../components/views/profile/DeleteAccount';
import { deleteCustomer } from '../../../../services/services';

// Mock dependencies
jest.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../../../services/services', () => ({
  deleteCustomer: jest.fn(),
}));

jest.mock('react-icons/tb', () => ({
  TbUserCancel: () => <svg data-testid='user-cancel-icon' />,
}));

// Mock AlertSection component
jest.mock('../../../../components/common/AlertSection', () => {
  return function MockAlertSection({
    show,
    setShow,
    onClick,
    buttonTitle,
    title,
  }) {
    return show ? (
      <div data-testid='alert-section'>
        <div>{title}</div>
        <button data-testid='confirm-delete-button' onClick={onClick}>
          {buttonTitle}
        </button>
        <button
          data-testid='cancel-delete-button'
          onClick={() => setShow(false)}
        >
          Cancel
        </button>
      </div>
    ) : null;
  };
});

describe('DeleteAccount', () => {
  const mockSignOut = jest.fn();
  const mockNavigate = jest.fn();
  const mockCustomerData = {
    customerId: '12345',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useAuthenticator.mockReturnValue({
      signOut: mockSignOut,
    });

    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders delete account section with title and button', () => {
    render(<DeleteAccount customerData={mockCustomerData} />);

    const titleElements = screen.getAllByText('Delete Account');
    expect(titleElements).toHaveLength(2); // Title and button text
    expect(
      screen.getByRole('button', { name: /delete account/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('user-cancel-icon')).toBeInTheDocument();
  });

  test('shows warning dialog when delete button is clicked', () => {
    render(<DeleteAccount customerData={mockCustomerData} />);

    const deleteButton = screen.getByRole('button', {
      name: /delete account/i,
    });
    fireEvent.click(deleteButton);

    expect(screen.getByTestId('alert-section')).toBeInTheDocument();
    expect(
      screen.getByText(/are you sure you want to delete your account/i),
    ).toBeInTheDocument();
  });

  test('hides warning dialog when cancel is clicked', () => {
    render(<DeleteAccount customerData={mockCustomerData} />);

    // Show the dialog
    const deleteButton = screen.getByRole('button', {
      name: /delete account/i,
    });
    fireEvent.click(deleteButton);

    expect(screen.getByTestId('alert-section')).toBeInTheDocument();

    // Cancel the dialog
    const cancelButton = screen.getByTestId('cancel-delete-button');
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId('alert-section')).not.toBeInTheDocument();
  });

  test('calls deleteCustomer, signOut, and navigate when confirmed', async () => {
    deleteCustomer.mockResolvedValue();

    render(<DeleteAccount customerData={mockCustomerData} />);

    // Show the dialog
    const deleteButton = screen.getByRole('button', {
      name: /delete account/i,
    });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByTestId('confirm-delete-button');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteCustomer).toHaveBeenCalledWith('12345');
    });

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles deletion error gracefully', async () => {
    const error = new Error('Deletion failed');
    deleteCustomer.mockRejectedValue(error);

    render(<DeleteAccount customerData={mockCustomerData} />);

    // Show the dialog
    const deleteButton = screen.getByRole('button', {
      name: /delete account/i,
    });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByTestId('confirm-delete-button');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteCustomer).toHaveBeenCalledWith('12345');
    });

    // Should stop deleting on error - get the original delete button (first one)
    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', {
        name: /delete account/i,
      });
      const [originalDeleteButton] = deleteButtons; // First is the main delete button
      expect(originalDeleteButton).not.toBeDisabled();
    });

    // Should not sign out or navigate on error
    expect(mockSignOut).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('disables delete button and shows spinner while deleting', async () => {
    deleteCustomer.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<DeleteAccount customerData={mockCustomerData} />);

    // Show the dialog
    const deleteButton = screen.getByRole('button', {
      name: /delete account/i,
    });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByTestId('confirm-delete-button');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteButton).toBeDisabled();
    });

    // Check that spinner is shown instead of user cancel icon
    expect(screen.queryByTestId('user-cancel-icon')).not.toBeInTheDocument();
  });

  test('applies correct CSS classes and styling', () => {
    const { container } = render(
      <DeleteAccount customerData={mockCustomerData} />,
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

  test('passes correct props to AlertSection', () => {
    render(<DeleteAccount customerData={mockCustomerData} />);

    const deleteButton = screen.getByRole('button', {
      name: /delete account/i,
    });
    fireEvent.click(deleteButton);

    expect(screen.getByTestId('confirm-delete-button')).toHaveTextContent(
      'Delete Account',
    );
    expect(
      screen.getByText(/are you sure you want to delete your account/i),
    ).toBeInTheDocument();
  });
});
