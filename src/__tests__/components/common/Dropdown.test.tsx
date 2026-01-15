import { fireEvent, render, screen } from '@testing-library/react';
import { Control, useController } from 'react-hook-form';
import { vi } from 'vitest';

import Dropdown, {
  ControlledDropdown,
} from '../../../components/common/Dropdown';

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useController: vi.fn(() => ({
    field: {
      onChange: vi.fn(),
      value: undefined,
    },
  })),
}));

vi.mock('@szhsin/react-menu', () => ({
  Menu: (props: { children: React.ReactNode; menuButton: React.ReactNode }) => (
    <div data-testid='menu'>
      {props.menuButton}
      <div data-testid='menu-content'>{props.children}</div>
    </div>
  ),
  MenuButton: (props: { children: React.ReactNode; className?: string }) => (
    <button className={props.className} data-testid='menu-button'>
      {props.children}
    </button>
  ),
  MenuItem: (props: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <div
      className={props.className}
      data-testid='menu-item'
      onClick={props.onClick}
      role='menuitem'
    >
      {props.children}
    </div>
  ),
  MenuDivider: (props: { className?: string }) => (
    <hr className={props.className} data-testid='menu-divider' />
  ),
}));

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaChevronDown: (props: { className?: string; size?: number | string }) => (
    <span
      className={props.className}
      data-size={props.size}
      data-testid='chevron-icon'
    >
      ▼
    </span>
  ),
}));

// Mock classnames
vi.mock('classnames', () => {
  const mockClassNames = vi.fn((baseClass: string, additionalClass?: string) =>
    [baseClass, additionalClass].filter(Boolean).join(' '),
  );
  return { default: mockClassNames };
});

describe('Dropdown', () => {
  const mockOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  const defaultProps = {
    options: mockOptions,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders dropdown with default first option selected', () => {
    render(<Dropdown {...defaultProps} />);

    expect(screen.getByTestId('menu-button')).toBeInTheDocument();
    // Check for Option 1 in the button specifically
    expect(screen.getByTestId('menu-button')).toHaveTextContent('Option 1');
  });

  test('renders dropdown with specified value', () => {
    render(<Dropdown {...defaultProps} value={mockOptions[1]} />);

    expect(screen.getByTestId('menu-button')).toHaveTextContent('Option 2');
  });

  test('renders prefix label when provided', () => {
    render(<Dropdown {...defaultProps} prefixLabel='Filter' />);

    expect(screen.getByText('Filter:')).toBeInTheDocument();
  });

  test('renders all menu items', () => {
    render(<Dropdown {...defaultProps} />);

    const menuItems = screen.getAllByTestId('menu-item');
    expect(menuItems).toHaveLength(3);
  });

  test('calls onChange when menu item is clicked', () => {
    const mockOnChange = vi.fn();
    render(<Dropdown {...defaultProps} onChange={mockOnChange} />);

    const menuItems = screen.getAllByTestId('menu-item');
    fireEvent.click(menuItems[1]!);

    expect(mockOnChange).toHaveBeenCalledWith(mockOptions[1]);
  });

  test('renders chevron down icon', () => {
    render(<Dropdown {...defaultProps} />);

    const chevronIcon = screen.getByTestId('chevron-icon');
    expect(chevronIcon).toBeInTheDocument();
    expect(chevronIcon).toHaveAttribute('data-size', '14');
  });

  test('applies custom className', () => {
    render(<Dropdown {...defaultProps} className='custom-class' />);

    // The className is applied to the wrapper div
    expect(screen.getByTestId('menu')).toBeInTheDocument();
  });

  test('renders option with icon when provided', () => {
    const optionsWithIcon = [
      {
        value: '1',
        label: 'Option 1',
        icon: <span data-testid='option-icon'>📁</span>,
      },
      { value: '2', label: 'Option 2' },
    ];

    render(<Dropdown {...defaultProps} options={optionsWithIcon} />);

    expect(screen.getByTestId('option-icon')).toBeInTheDocument();
  });

  test('renders divider when option has divider property', () => {
    const optionsWithDivider = [
      { value: '1', label: 'Option 1' },
      { value: 'divider', label: '', divider: true },
      { value: '2', label: 'Option 2' },
    ];

    render(<Dropdown {...defaultProps} options={optionsWithDivider} />);

    expect(screen.getByTestId('menu-divider')).toBeInTheDocument();
  });

  test('handles empty options array', () => {
    render(<Dropdown {...defaultProps} options={[]} />);

    expect(screen.getByTestId('menu-button')).toBeInTheDocument();
    expect(screen.queryAllByTestId('menu-item')).toHaveLength(0);
  });

  test('handles undefined options', () => {
    render(<Dropdown {...defaultProps} options={undefined} />);

    expect(screen.getByTestId('menu-button')).toBeInTheDocument();
  });

  test('applies correct CSS classes to menu button', () => {
    render(<Dropdown {...defaultProps} />);

    const menuButton = screen.getByTestId('menu-button');
    expect(menuButton).toHaveClass(
      'border-1',
      'flex',
      'items-center',
      'rounded-full',
      'border-solid',
      'border-border-color',
      'bg-white',
      'text-black',
      'dark:bg-gray-800',
      'dark:text-gray-100',
    );
  });

  test('displays correct value label in button', () => {
    const customValue = { value: 'custom', label: 'Custom Option' };
    render(<Dropdown {...defaultProps} value={customValue} />);

    expect(screen.getByText('Custom Option')).toBeInTheDocument();
  });

  test('handles onClick for multiple options', () => {
    const mockOnChange = vi.fn();
    render(<Dropdown {...defaultProps} onChange={mockOnChange} />);

    const menuItems = screen.getAllByTestId('menu-item');

    fireEvent.click(menuItems[0]!);
    expect(mockOnChange).toHaveBeenCalledWith(mockOptions[0]);

    fireEvent.click(menuItems[2]!);
    expect(mockOnChange).toHaveBeenCalledWith(mockOptions[2]);

    expect(mockOnChange).toHaveBeenCalledTimes(2);
  });

  test('renders option without icon when icon is undefined', () => {
    const optionsWithUndefinedIcon = [
      { value: '1', label: 'Option 1', icon: undefined },
    ];

    render(<Dropdown {...defaultProps} options={optionsWithUndefinedIcon} />);

    expect(screen.getAllByTestId('menu-item')).toHaveLength(1);
    expect(screen.queryByTestId('option-icon')).not.toBeInTheDocument();
  });
});

describe('ControlledDropdown', () => {
  type TestFormData = Record<string, unknown>;

  const mockOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useController.mockReturnValue({
      field: {
        onChange: vi.fn(),
        value: mockOptions[0],
      },
    });
  });

  test('renders controlled dropdown', () => {
    render(
      <ControlledDropdown
        control={{} as unknown as Control<TestFormData>}
        name='test-dropdown'
        options={mockOptions}
      />,
    );

    expect(screen.getByTestId('menu-button')).toBeInTheDocument();
  });

  test('uses useController hook with correct parameters', () => {
    const mockControl = { test: 'control' } as unknown as Control<TestFormData>;

    render(
      <ControlledDropdown
        control={mockControl}
        name='test-dropdown'
        options={mockOptions}
      />,
    );

    expect(useController).toHaveBeenCalledWith({
      name: 'test-dropdown',
      control: mockControl,
    });
  });

  test('passes field.onChange to Dropdown', () => {
    const mockFieldOnChange = vi.fn();
    useController.mockReturnValue({
      field: {
        onChange: mockFieldOnChange,
        value: mockOptions[0],
      },
    });

    render(
      <ControlledDropdown
        control={{} as unknown as Control<TestFormData>}
        name='test-dropdown'
        options={mockOptions}
      />,
    );

    const menuItems = screen.getAllByTestId('menu-item');
    fireEvent.click(menuItems[1]!);

    expect(mockFieldOnChange).toHaveBeenCalledWith(mockOptions[1]);
  });

  test('passes additional props to Dropdown', () => {
    render(
      <ControlledDropdown
        className='controlled-class'
        control={{} as unknown as Control<TestFormData>}
        name='test-dropdown'
        options={mockOptions}
        prefixLabel='Controlled'
      />,
    );

    expect(screen.getByText('Controlled:')).toBeInTheDocument();
  });
});
