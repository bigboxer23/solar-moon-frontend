/* eslint-env jest */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Check, ControlledCheck } from '../../../components/common/Check';

describe('Check', () => {
  const defaultInputProps = {
    value: false,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders checkbox with label', () => {
    const { container } = render(
      <Check
        id='test-check'
        inputProps={defaultInputProps}
        label='Test Label'
      />,
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  test('renders checkbox without label', () => {
    const { container } = render(
      <Check id='test-check' inputProps={defaultInputProps} />,
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(container.querySelector('.Input')).toBeInTheDocument();
  });

  test('handles checked state', () => {
    const checkedInputProps = { ...defaultInputProps, value: true };
    const { container } = render(
      <Check id='test-check' inputProps={checkedInputProps} />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  test('handles unchecked state', () => {
    const { container } = render(
      <Check id='test-check' inputProps={defaultInputProps} />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('calls onChange when checkbox is clicked', () => {
    const mockOnChange = jest.fn();
    const inputProps = { ...defaultInputProps, onChange: mockOnChange };

    const { container } = render(
      <Check id='test-check' inputProps={inputProps} />,
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  test('calls onClick when wrapper is clicked', () => {
    const mockOnClick = jest.fn();
    const { container } = render(
      <Check
        id='test-check'
        inputProps={defaultInputProps}
        onClick={mockOnClick}
      />,
    );

    const wrapper = container.querySelector('.Input');
    fireEvent.click(wrapper);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('renders prefix and suffix', () => {
    const { container } = render(
      <Check
        id='test-check'
        inputProps={defaultInputProps}
        prefix={<span>Before</span>}
        suffix={<span>After</span>}
      />,
    );

    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
  });

  test('displays error message', () => {
    const { container } = render(
      <Check
        errorMessage='This field is required'
        id='test-check'
        inputProps={defaultInputProps}
      />,
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(
      <Check
        className='custom-class'
        id='test-check'
        inputProps={defaultInputProps}
      />,
    );

    const wrapper = container.querySelector('.Input');
    expect(wrapper).toHaveClass('custom-class');
  });

  test('applies custom input className', () => {
    const { container } = render(
      <Check
        id='test-check'
        inputClassName='custom-input'
        inputProps={defaultInputProps}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('custom-input');
  });

  test('applies custom label className', () => {
    const { container } = render(
      <Check
        id='test-check'
        inputProps={defaultInputProps}
        label='Test Label'
        labelClassName='custom-label'
      />,
    );

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('custom-label');
  });

  test('extends variant styles by default', () => {
    const { container } = render(
      <Check
        id='test-check'
        inputClassName='custom-input'
        inputProps={defaultInputProps}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass(
      'outline-none',
      'switch-checkbox',
      'custom-input',
    );
  });

  test('replaces variant styles when extendVariantStyles is false', () => {
    const { container } = render(
      <Check
        extendVariantStyles={false}
        id='test-check'
        inputClassName='only-custom'
        inputProps={defaultInputProps}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('only-custom');
    expect(checkbox).not.toHaveClass('outline-none');
  });

  test('has proper label association', () => {
    const { container } = render(
      <Check id='test-check' inputProps={defaultInputProps} />,
    );

    const checkbox = screen.getByRole('checkbox');
    const label = container.querySelector('label[for="test-check"]');

    expect(checkbox).toHaveAttribute('id', 'test-check');
    expect(label).toHaveAttribute('for', 'test-check');
  });

  test('passes additional input props', () => {
    const inputProps = {
      ...defaultInputProps,
      'data-testid': 'custom-checkbox',
      disabled: true,
    };

    const { container } = render(
      <Check id='test-check' inputProps={inputProps} />,
    );

    const checkbox = screen.getByTestId('custom-checkbox');
    expect(checkbox).toBeDisabled();
  });
});

describe('ControlledCheck', () => {
  function TestForm({ defaultValue = false, onSubmit = jest.fn() }) {
    const { control, handleSubmit } = useForm({
      defaultValues: { testCheck: defaultValue },
    });

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <ControlledCheck
          control={control}
          label='Controlled Check'
          name='testCheck'
          prefix={<span>Prefix</span>}
          suffix={<span>Suffix</span>}
        />
        <button type='submit'>Submit</button>
      </form>
    );
  }

  test('renders controlled checkbox with react-hook-form', () => {
    render(<TestForm />);

    expect(screen.getByText('Controlled Check')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    // Note: Prefix and Suffix are rendered but may not be visible in this test context
  });

  test('uses default value from form', () => {
    render(<TestForm defaultValue={true} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  test('integrates with form submission', async () => {
    const mockSubmit = jest.fn();
    render(<TestForm onSubmit={mockSubmit} />);

    const checkbox = screen.getByRole('checkbox');
    const submitButton = screen.getByText('Submit');

    fireEvent.click(checkbox);
    fireEvent.click(submitButton);

    // Wait a tick for form submission to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ testCheck: true }),
      expect.any(Object),
    );
  });

  test('generates unique id when not provided', () => {
    render(<TestForm />);

    const checkbox = screen.getByRole('checkbox');
    const id = checkbox.getAttribute('id');
    expect(id).toBeTruthy();
    expect(id.length).toBeGreaterThan(0);
  });

  test('uses provided id', () => {
    function TestFormWithId() {
      const { control } = useForm({ defaultValues: { testCheck: false } });
      return (
        <ControlledCheck
          control={control}
          id='custom-id'
          label='Custom ID Check'
          name='testCheck'
        />
      );
    }

    render(<TestFormWithId />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'custom-id');
  });
});
