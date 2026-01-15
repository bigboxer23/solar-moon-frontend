import { fireEvent, render, screen } from '@testing-library/react';
import { Control, useController } from 'react-hook-form';
import { vi } from 'vitest';

import { ControlledSelect, Select } from '../../../components/common/Select';

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useController: vi.fn(() => ({
    field: {
      onChange: vi.fn(),
      value: '1',
      name: 'test-select',
    },
  })),
}));

describe('Select', () => {
  const mockAttributes = [
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' },
    { id: '3', label: 'Option 3' },
  ];

  const defaultProps = {
    attributes: mockAttributes,
    inputProps: {
      name: 'test-select',
      onChange: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders select component', () => {
    render(<Select {...defaultProps} />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
  });

  test('renders all options', () => {
    render(<Select {...defaultProps} />);

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]!).toHaveTextContent('Option 1');
    expect(options[1]!).toHaveTextContent('Option 2');
    expect(options[2]!).toHaveTextContent('Option 3');
  });

  test('renders options with correct values', () => {
    render(<Select {...defaultProps} />);

    const options = screen.getAllByRole('option');
    expect(options[0]!).toHaveValue('1');
    expect(options[1]!).toHaveValue('2');
    expect(options[2]!).toHaveValue('3');
  });

  test('renders with label when provided', () => {
    render(<Select {...defaultProps} label='Test Label' />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  test('renders without label when not provided', () => {
    render(<Select {...defaultProps} />);

    const label = screen.queryByText('Test Label');
    expect(label).not.toBeInTheDocument();
  });

  test('applies default box variant styles', () => {
    render(<Select {...defaultProps} />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveClass(
      'grow',
      'outline-none',
      'text-black',
      'dark:text-gray-100',
    );
  });

  test('applies underline variant styles', () => {
    render(<Select {...defaultProps} variant='underline' />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveClass(
      'grow',
      'outline-none',
      'bg-transparent',
      'text-black',
      'dark:text-gray-100',
      'max-w-full',
    );
  });

  test('applies custom input class name', () => {
    render(<Select {...defaultProps} inputClassName='custom-input-class' />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveClass('custom-input-class');
  });

  test('applies custom wrapper class name with box variant', () => {
    render(<Select {...defaultProps} wrapperClassName='custom-wrapper' />);

    const wrapper = screen.getByRole('combobox').closest('label');
    expect(wrapper).toHaveClass('custom-wrapper');
  });

  test('applies custom label class name', () => {
    render(
      <Select
        {...defaultProps}
        label='Test Label'
        labelClassName='custom-label'
      />,
    );

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('custom-label');
  });

  test('displays error message when provided', () => {
    render(<Select {...defaultProps} errorMessage='This field is required' />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('applies custom error class name', () => {
    render(
      <Select
        {...defaultProps}
        errorClassName='custom-error'
        errorMessage='Error'
      />,
    );

    const errorElement = screen.getByText('Error');
    expect(errorElement).toHaveClass('custom-error');
  });

  test('renders prefix when provided', () => {
    const prefix = <span data-testid='prefix'>$</span>;
    render(<Select {...defaultProps} prefix={prefix} />);

    expect(screen.getByTestId('prefix')).toBeInTheDocument();
  });

  test('renders suffix when provided', () => {
    const suffix = <span data-testid='suffix'>%</span>;
    render(<Select {...defaultProps} suffix={suffix} />);

    expect(screen.getByTestId('suffix')).toBeInTheDocument();
  });

  test('calls onChange when option is selected', () => {
    const mockOnChange = vi.fn();
    render(
      <Select
        {...defaultProps}
        inputProps={{ ...defaultProps.inputProps, onChange: mockOnChange }}
      />,
    );

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: '2' } });

    expect(mockOnChange).toHaveBeenCalled();
  });

  test('extends variant styles by default', () => {
    render(
      <Select
        {...defaultProps}
        extendVariantStyles={true}
        inputClassName='custom-class'
      />,
    );

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveClass('grow', 'custom-class');
  });

  test('replaces variant styles when extendVariantStyles is false', () => {
    render(
      <Select
        {...defaultProps}
        extendVariantStyles={false}
        inputClassName='custom-class'
      />,
    );

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveClass('custom-class');
    expect(selectElement).not.toHaveClass('grow');
  });

  test('handles empty attributes array', () => {
    render(<Select {...defaultProps} attributes={[]} />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  test('passes through input props', () => {
    render(
      <Select
        {...defaultProps}
        inputProps={{
          ...defaultProps.inputProps,
          'data-testid': 'custom-select',
          disabled: true,
        }}
      />,
    );

    const selectElement = screen.getByTestId('custom-select');
    expect(selectElement).toBeDisabled();
  });

  test('renders with correct DOM structure', () => {
    render(
      <Select
        {...defaultProps}
        label='Test Label'
        prefix={<span data-testid='prefix'>$</span>}
        suffix={<span data-testid='suffix'>%</span>}
      />,
    );

    const label = screen.getByText('Test Label');
    const selectElement = screen.getByRole('combobox');
    const prefix = screen.getByTestId('prefix');
    const suffix = screen.getByTestId('suffix');

    expect(label.parentElement?.contains(selectElement)).toBe(true);
    expect(prefix.parentElement?.contains(selectElement)).toBe(true);
    expect(suffix.parentElement?.contains(selectElement)).toBe(true);
  });

  test('label wrapper has Input class', () => {
    render(<Select {...defaultProps} label='Test Label' />);

    const labelWrapper = screen.getByText('Test Label').closest('label');
    expect(labelWrapper).toHaveClass('Input');
  });
});

describe('ControlledSelect', () => {
  type TestFormData = Record<string, unknown>;

  const mockAttributes = [
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useController.mockReturnValue({
      field: {
        onChange: vi.fn(),
        value: '1',
        name: 'test-controlled-select',
      },
    });
  });

  test('renders controlled select', () => {
    render(
      <ControlledSelect
        attributes={mockAttributes}
        control={{} as unknown as Control<TestFormData>}
        name='test-controlled'
      />,
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('uses useController hook with correct parameters', () => {
    const mockControl = { test: 'control' } as unknown as Control<TestFormData>;

    render(
      <ControlledSelect
        attributes={mockAttributes}
        control={mockControl}
        name='test-controlled'
      />,
    );

    expect(useController).toHaveBeenCalledWith({
      control: mockControl,
      name: 'test-controlled',
    });
  });

  test('passes field props to Select inputProps', () => {
    const mockField = {
      onChange: vi.fn(),
      value: '2',
      name: 'controlled-field',
    };

    useController.mockReturnValue({
      field: mockField,
    });

    render(
      <ControlledSelect
        attributes={mockAttributes}
        control={{} as unknown as Control<TestFormData>}
        inputProps={{ 'data-testid': 'controlled-select' }}
        name='test-controlled'
      />,
    );

    const selectElement = screen.getByTestId('controlled-select');
    expect(selectElement).toHaveValue('2');
    expect(selectElement).toHaveAttribute('name', 'controlled-field');
  });

  test('merges additional inputProps with field props', () => {
    render(
      <ControlledSelect
        attributes={mockAttributes}
        control={{} as unknown as Control<TestFormData>}
        inputProps={{ 'data-testid': 'merged-select', disabled: true }}
        name='test-controlled'
      />,
    );

    const selectElement = screen.getByTestId('merged-select');
    expect(selectElement).toBeDisabled();
  });

  test('passes through other props to Select', () => {
    render(
      <ControlledSelect
        attributes={mockAttributes}
        control={{} as unknown as Control<TestFormData>}
        label='Controlled Label'
        name='test-controlled'
        variant='underline'
      />,
    );

    expect(screen.getByText('Controlled Label')).toBeInTheDocument();
    // Check that the underline variant is applied by checking classes
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveClass('bg-transparent');
  });

  test('handles change events through field.onChange', () => {
    const mockOnChange = vi.fn();
    useController.mockReturnValue({
      field: {
        onChange: mockOnChange,
        value: '1',
        name: 'test-field',
      },
    });

    render(
      <ControlledSelect
        attributes={mockAttributes}
        control={{} as unknown as Control<TestFormData>}
        name='test-controlled'
      />,
    );

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: '2' } });

    expect(mockOnChange).toHaveBeenCalled();
  });
});
