/* eslint-env jest */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import MappingBlock from '../../../../components/views/mapping/MappingBlock';

jest.mock('react-icons/md', () => ({
  MdLock: () => <div data-testid='lock-icon' />,
  MdOutlineDelete: () => <div data-testid='delete-icon' />,
}));

describe('MappingBlock', () => {
  const mockDeleteMapping = jest.fn();

  const defaultProps = {
    attribute: 'Current',
    mappingName: 'Test Mapping',
    showDelete: true,
    deleteMapping: mockDeleteMapping,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders mapping name and attribute', () => {
    render(<MappingBlock {...defaultProps} />);

    expect(screen.getByText('Test Mapping')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
    expect(screen.getByText('->')).toBeInTheDocument();
  });

  test('renders delete button when showDelete is true', () => {
    render(<MappingBlock {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /delete mapping/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('lock-icon')).not.toBeInTheDocument();
  });

  test('renders lock icon when showDelete is false', () => {
    render(<MappingBlock {...defaultProps} showDelete={false} />);

    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /delete mapping/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();
  });

  test('calls deleteMapping when delete button is clicked', () => {
    render(<MappingBlock {...defaultProps} />);

    const deleteButton = screen.getByRole('button', {
      name: /delete mapping/i,
    });
    fireEvent.click(deleteButton);

    expect(mockDeleteMapping).toHaveBeenCalledWith('Test Mapping');
  });

  test('shows loading state when delete button is clicked', async () => {
    render(<MappingBlock {...defaultProps} />);

    const deleteButton = screen.getByRole('button', {
      name: /delete mapping/i,
    });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();
    });

    expect(deleteButton).toBeDisabled();
  });

  test('renders with correct CSS classes', () => {
    const { container } = render(<MappingBlock {...defaultProps} />);

    const mappingBlockDiv = container.querySelector('.MappingBlock');
    expect(mappingBlockDiv).toHaveClass(
      'MappingBlock',
      'flex',
      'w-full',
      'items-center',
      'overflow-hidden',
      'rounded-md',
      'bg-grid-background-alt',
      'p-4',
      'dark:bg-gray-700',
      'dark:text-gray-100',
    );
  });

  test('renders mapping name with correct styling', () => {
    const { container } = render(<MappingBlock {...defaultProps} />);

    const mappingNameDiv = container.querySelector('.text-sm.font-extrabold');
    expect(mappingNameDiv).toBeInTheDocument();
    expect(mappingNameDiv).toHaveTextContent('Test Mapping');
  });

  test('renders attribute with correct styling', () => {
    const { container } = render(<MappingBlock {...defaultProps} />);

    const attributeDiv = container.querySelector('.text-sm.italic');
    expect(attributeDiv).toBeInTheDocument();
    expect(attributeDiv).toHaveTextContent('Current');
  });

  test('renders arrow with correct styling', () => {
    const { container } = render(<MappingBlock {...defaultProps} />);

    const arrowSpan = container.querySelector('.pe-2.ps-2');
    expect(arrowSpan).toBeInTheDocument();
    expect(arrowSpan).toHaveTextContent('->');
  });

  test('delete button has correct title attribute', () => {
    render(<MappingBlock {...defaultProps} />);

    const deleteButton = screen.getByRole('button', {
      name: /delete mapping/i,
    });
    expect(deleteButton).toHaveAttribute('title', 'Delete Mapping');
  });

  test('lock icon is rendered when showDelete is false', () => {
    render(<MappingBlock {...defaultProps} showDelete={false} />);

    const lockIcon = screen.getByTestId('lock-icon');
    expect(lockIcon).toBeInTheDocument();

    // The CSS classes are on the actual MdLock component in the real code
    // Since we're mocking it, we can't test the specific classes, but we can verify it renders
    expect(lockIcon).toBeInTheDocument();
  });

  test('delete button has correct styling', () => {
    const { container } = render(<MappingBlock {...defaultProps} />);

    const deleteButton = container.querySelector('button');
    expect(deleteButton).toHaveClass('ml-auto');
  });

  test('handles different mapping names and attributes', () => {
    const props = {
      ...defaultProps,
      mappingName: 'Custom Voltage Mapping',
      attribute: 'System Voltage',
    };

    render(<MappingBlock {...props} />);

    expect(screen.getByText('Custom Voltage Mapping')).toBeInTheDocument();
    expect(screen.getByText('System Voltage')).toBeInTheDocument();
  });

  test('handles empty mapping name', () => {
    const props = {
      ...defaultProps,
      mappingName: '',
    };

    render(<MappingBlock {...props} />);

    const mappingNameDiv = screen
      .getByText('Current')
      .closest('.MappingBlock')
      .querySelector('.font-extrabold');
    expect(mappingNameDiv).toHaveTextContent('');
  });

  test('handles empty attribute', () => {
    const props = {
      ...defaultProps,
      attribute: '',
    };

    render(<MappingBlock {...props} />);

    const attributeDiv = screen
      .getByText('Test Mapping')
      .closest('.MappingBlock')
      .querySelector('.italic');
    expect(attributeDiv).toHaveTextContent('');
  });
});
