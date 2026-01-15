import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { updatePassword } from 'aws-amplify/auth';
import React from 'react';
import { toast } from 'react-toastify';
import { vi } from 'vitest';

import ChangePassword from '../../../../components/views/profile/ChangePassword';

// Mock dependencies
vi.mock('aws-amplify/auth', () => ({
  updatePassword: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  ToastContainer: () => <div data-testid='toast-container' />,
}));

vi.mock('react-icons/md', () => ({
  MdOutlinePassword: () => <svg data-testid='password-icon' />,
}));

describe('ChangePassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders form with all required fields', () => {
    render(<ChangePassword />);

    const titleElements = screen.getAllByText('Change Password');
    expect(titleElements).toHaveLength(2); // Title and button
    expect(screen.getByLabelText('Old Password')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /change password/i }),
    ).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(<ChangePassword />);

    const submitButton = screen.getByRole('button', {
      name: /change password/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Old password is required')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('New password is required')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText('Password confirmation is required'),
      ).toBeInTheDocument();
    });
  });

  test('shows validation error when passwords do not match', async () => {
    render(<ChangePassword />);

    const oldPasswordInput = screen.getByLabelText('Old Password');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
    const submitButton = screen.getByRole('button', {
      name: /change password/i,
    });

    fireEvent.change(oldPasswordInput, { target: { value: 'oldpass123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'differentpass' },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('New password does not match'),
      ).toBeInTheDocument();
    });
  });

  test('successfully submits form with valid data', async () => {
    updatePassword.mockResolvedValue();

    render(<ChangePassword />);

    const oldPasswordInput = screen.getByLabelText('Old Password');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
    const submitButton = screen.getByRole('button', {
      name: /change password/i,
    });

    fireEvent.change(oldPasswordInput, { target: { value: 'oldpass123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpass123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalledWith({
        oldPassword: 'oldpass123',
        newPassword: 'newpass123',
      });
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Password successfully updated!',
        expect.objectContaining({
          position: 'bottom-right',
          autoClose: 2500,
        }),
      );
    });
  });

  test('shows error toast when password update fails', async () => {
    const error = new Error('Update failed');
    updatePassword.mockRejectedValue(error);

    render(<ChangePassword />);

    const oldPasswordInput = screen.getByLabelText('Old Password');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
    const submitButton = screen.getByRole('button', {
      name: /change password/i,
    });

    fireEvent.change(oldPasswordInput, { target: { value: 'oldpass123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpass123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Unable to update password.',
        expect.objectContaining({
          position: 'bottom-right',
          autoClose: 2500,
        }),
      );
    });
  });

  test('disables submit button and shows spinner while loading', async () => {
    updatePassword.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<ChangePassword />);

    const oldPasswordInput = screen.getByLabelText('Old Password');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
    const submitButton = screen.getByRole('button', {
      name: /change password/i,
    });

    fireEvent.change(oldPasswordInput, { target: { value: 'oldpass123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpass123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    // Check that spinner is shown instead of password icon
    expect(screen.queryByTestId('password-icon')).not.toBeInTheDocument();
  });

  test('has correct input field types and placeholders', () => {
    render(<ChangePassword />);

    const oldPasswordInput = screen.getByLabelText('Old Password');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');

    expect(oldPasswordInput).toHaveAttribute('type', 'password');
    expect(oldPasswordInput).toHaveAttribute('placeholder', 'Old Password');

    expect(newPasswordInput).toHaveAttribute('type', 'password');
    expect(newPasswordInput).toHaveAttribute('placeholder', 'New Password');

    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute(
      'placeholder',
      'Confirm New Password',
    );
  });

  test('renders toast container', () => {
    render(<ChangePassword />);

    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });
});
