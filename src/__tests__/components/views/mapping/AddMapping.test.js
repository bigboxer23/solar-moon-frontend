/* eslint-env jest */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import AddMapping from '../../../../components/views/mapping/AddMapping';
import { addMapping } from '../../../../services/services';

jest.mock('../../../../services/services', () => ({
  addMapping: jest.fn(),
}));

jest.mock('react-icons/md', () => ({
  MdOutlineAddCircle: () => <div data-testid='add-circle-icon' />,
}));

jest.mock('../../../../components/views/mapping/MappingConstants', () => ({
  attributes: [
    'Average Current',
    'Voltage',
    'System Power Factor',
    'Energy Consumption',
    'Real Power',
  ],
  attributeMappings: {
    'Average Current': 'Current',
    'Voltage, Line to Neutral': 'Voltage',
    'Power Factor': 'System Power Factor',
  },
}));

describe('AddMapping', () => {
  const mockSetMappings = jest.fn();

  const existingMappings = [
    { mappingName: 'Existing Mapping', attribute: 'Current' },
  ];

  const defaultProps = {
    mappings: existingMappings,
    setMappings: mockSetMappings,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    addMapping.mockResolvedValue();
  });

  test('renders form with mapping name input', () => {
    render(<AddMapping {...defaultProps} />);

    expect(screen.getByLabelText(/mapping name/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/voltage.*current.*pf/i),
    ).toBeInTheDocument();
  });

  test('renders form with attribute select', () => {
    render(<AddMapping {...defaultProps} />);

    expect(screen.getByLabelText(/attribute/i)).toBeInTheDocument();
  });

  test('renders add button', () => {
    render(<AddMapping {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /add attribute/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('add-circle-icon')).toBeInTheDocument();
  });

  test('renders arrow indicator between fields', () => {
    render(<AddMapping {...defaultProps} />);

    expect(screen.getByText('->')).toBeInTheDocument();
  });

  test('has default values set correctly', () => {
    render(<AddMapping {...defaultProps} />);

    const mappingNameInput = screen.getByLabelText(/mapping name/i);
    expect(mappingNameInput).toHaveValue('');
  });

  test('validates required mapping name field', async () => {
    render(<AddMapping {...defaultProps} />);

    const mappingNameInput = screen.getByLabelText(/mapping name/i);
    fireEvent.blur(mappingNameInput);

    await waitFor(() => {
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  test('validates duplicate mapping name from existing mappings', async () => {
    render(<AddMapping {...defaultProps} />);

    const mappingNameInput = screen.getByLabelText(/mapping name/i);
    fireEvent.change(mappingNameInput, {
      target: { value: 'Existing Mapping' },
    });
    fireEvent.blur(mappingNameInput);

    await waitFor(() => {
      expect(screen.getByText('Already added')).toBeInTheDocument();
    });
  });

  test('validates duplicate mapping name from attribute mappings', async () => {
    render(<AddMapping {...defaultProps} />);

    const mappingNameInput = screen.getByLabelText(/mapping name/i);
    fireEvent.change(mappingNameInput, {
      target: { value: 'Average Current' },
    });
    fireEvent.blur(mappingNameInput);

    await waitFor(() => {
      expect(screen.getByText('Already added')).toBeInTheDocument();
    });
  });

  test('validates duplicate mapping name from attributes array', async () => {
    render(<AddMapping {...defaultProps} />);

    const mappingNameInput = screen.getByLabelText(/mapping name/i);
    fireEvent.change(mappingNameInput, { target: { value: 'Voltage' } });
    fireEvent.blur(mappingNameInput);

    await waitFor(() => {
      expect(screen.getByText('Already added')).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    render(<AddMapping {...defaultProps} />);

    const mappingNameInput = screen.getByLabelText(/mapping name/i);
    const submitButton = screen.getByRole('button', { name: /add attribute/i });

    fireEvent.change(mappingNameInput, { target: { value: 'New Mapping' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addMapping).toHaveBeenCalledWith('Average Current', 'New Mapping');
    });
  });

  test('updates mappings list after successful submission', async () => {
    render(<AddMapping {...defaultProps} />);

    const mappingNameInput = screen.getByLabelText(/mapping name/i);
    const submitButton = screen.getByRole('button', { name: /add attribute/i });

    fireEvent.change(mappingNameInput, { target: { value: 'New Mapping' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetMappings).toHaveBeenCalledWith([
        ...existingMappings,
        { mappingName: 'New Mapping', attribute: 'Average Current' },
      ]);
    });
  });

  test('resets form after successful submission', async () => {
    render(<AddMapping {...defaultProps} />);

    const mappingNameInput = screen.getByLabelText(/mapping name/i);
    const submitButton = screen.getByRole('button', { name: /add attribute/i });

    fireEvent.change(mappingNameInput, { target: { value: 'New Mapping' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mappingNameInput).toHaveValue('');
    });
  });

  test('trims whitespace from mapping name', async () => {
    render(<AddMapping {...defaultProps} />);

    const mappingNameInput = screen.getByLabelText(/mapping name/i);
    const submitButton = screen.getByRole('button', { name: /add attribute/i });

    fireEvent.change(mappingNameInput, {
      target: { value: '  Trimmed Mapping  ' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addMapping).toHaveBeenCalledWith(
        'Average Current',
        'Trimmed Mapping',
      );
    });

    await waitFor(() => {
      expect(mockSetMappings).toHaveBeenCalledWith([
        ...existingMappings,
        { mappingName: 'Trimmed Mapping', attribute: 'Average Current' },
      ]);
    });
  });

  test('shows spinner when loading', async () => {
    addMapping.mockImplementation(() => new Promise(() => {})); // Never resolving promise

    render(<AddMapping {...defaultProps} />);

    const mappingNameInput = screen.getByLabelText(/mapping name/i);
    const submitButton = screen.getByRole('button', { name: /add attribute/i });

    fireEvent.change(mappingNameInput, { target: { value: 'New Mapping' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByTestId('add-circle-icon')).not.toBeInTheDocument();
    });
  });

  test('disables button when loading', async () => {
    addMapping.mockImplementation(() => new Promise(() => {})); // Never resolving promise

    render(<AddMapping {...defaultProps} />);

    const mappingNameInput = screen.getByLabelText(/mapping name/i);
    const submitButton = screen.getByRole('button', { name: /add attribute/i });

    fireEvent.change(mappingNameInput, { target: { value: 'New Mapping' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  test('handles submission error gracefully', async () => {
    addMapping.mockRejectedValue(new Error('Submission failed'));

    render(<AddMapping {...defaultProps} />);

    const mappingNameInput = screen.getByLabelText(/mapping name/i);
    const submitButton = screen.getByRole('button', { name: /add attribute/i });

    fireEvent.change(mappingNameInput, { target: { value: 'New Mapping' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addMapping).toHaveBeenCalled();
    });

    // Should not update mappings list if submission failed
    expect(mockSetMappings).not.toHaveBeenCalled();
  });

  test('submits form when form is submitted', async () => {
    const { container } = render(<AddMapping {...defaultProps} />);

    const mappingNameInput = screen.getByLabelText(/mapping name/i);
    const form = container.querySelector('form');

    fireEvent.change(mappingNameInput, {
      target: { value: 'Form Submit Test' },
    });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(addMapping).toHaveBeenCalledWith(
        'Average Current',
        'Form Submit Test',
      );
    });
  });

  test('renders with correct CSS classes', () => {
    const { container } = render(<AddMapping {...defaultProps} />);

    const form = container.querySelector('form');
    expect(form).toHaveClass(
      'mb-4',
      'flex',
      'items-center',
      'rounded-md',
      'border-2',
      'p-4',
    );
  });

  test('case insensitive duplicate validation', async () => {
    render(<AddMapping {...defaultProps} />);

    const mappingNameInput = screen.getByLabelText(/mapping name/i);
    fireEvent.change(mappingNameInput, {
      target: { value: 'EXISTING MAPPING' },
    });
    fireEvent.blur(mappingNameInput);

    await waitFor(() => {
      expect(screen.getByText('Already added')).toBeInTheDocument();
    });
  });

  test('can select different attributes', async () => {
    render(<AddMapping {...defaultProps} />);

    const attributeSelect = screen.getByLabelText(/attribute/i);
    const submitButton = screen.getByRole('button', { name: /add attribute/i });
    const mappingNameInput = screen.getByLabelText(/mapping name/i);

    fireEvent.change(mappingNameInput, { target: { value: 'Voltage Test' } });
    fireEvent.change(attributeSelect, { target: { value: 'Voltage' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addMapping).toHaveBeenCalledWith('Voltage', 'Voltage Test');
    });
  });
});
