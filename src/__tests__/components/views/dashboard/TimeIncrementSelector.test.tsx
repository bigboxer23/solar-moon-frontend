import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { vi } from 'vitest';

import TimeIncrementSelector from '../../../../components/views/dashboard/TimeIncrementSelector';
import { DAY, MONTH, WEEK, YEAR } from '../../../../services/search';
import { timeIncrementToText } from '../../../../utils/Utils';

interface IconProps {
  className?: string;
}

interface MenuProps {
  children: React.ReactNode;
  menuButton: ReactElement;
  menuClassName: string;
  onItemClick: (event: { value: string }) => void;
}

interface MenuButtonProps {
  children: React.ReactNode;
  className: string;
}

interface MenuItemProps {
  children: React.ReactNode;
  className: string;
  value: string;
}

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaChevronDown: ({ className }: IconProps): ReactElement => (
    <span className={className} data-testid='chevron-down-icon'>
      ⬇️
    </span>
  ),
}));

// Mock search services
vi.mock('../../../../services/search', () => ({
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
}));

// Mock Utils
vi.mock('../../../../utils/Utils', () => ({
  timeIncrementToText: vi.fn(),
}));

// Mock @szhsin/react-menu
vi.mock('@szhsin/react-menu', () => ({
  Menu: ({
    children,
    menuButton,
    menuClassName,
    onItemClick,
  }: MenuProps): ReactElement => (
    <div data-menu-class={menuClassName} data-testid='menu'>
      {menuButton}
      <div
        data-testid='menu-items'
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          const target = e.target as HTMLElement;
          const value = target.getAttribute('data-value');
          if (value && onItemClick) {
            onItemClick({ value });
          }
        }}
      >
        {children}
      </div>
    </div>
  ),
  MenuButton: ({ children, className }: MenuButtonProps): ReactElement => (
    <button className={className} data-testid='menu-button-component'>
      {children}
    </button>
  ),
  MenuItem: ({ children, className, value }: MenuItemProps): ReactElement => (
    <div className={className} data-testid='menu-item' data-value={value}>
      {children}
    </div>
  ),
}));

describe('TimeIncrementSelector', () => {
  const mockSetTimeIncrement = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up the timeIncrementToText mock to return specific values
    timeIncrementToText.mockImplementation(
      (increment: string, withS: boolean) => {
        const mapping: Record<string, string> = {
          day: withS ? 'Days' : 'Day',
          week: withS ? 'Weeks' : 'Week',
          month: withS ? 'Months' : 'Month',
          year: withS ? 'Years' : 'Year',
        };
        return mapping[increment] || increment;
      },
    );
  });

  test('renders main container with correct CSS class', () => {
    const { container } = render(
      <TimeIncrementSelector
        setTimeIncrement={mockSetTimeIncrement}
        timeIncrement={WEEK}
      />,
    );

    const timeIncrementSelector = container.querySelector(
      '.TimeIncrementSelector',
    );
    expect(timeIncrementSelector).toBeInTheDocument();
  });

  test('renders Menu component with correct props', () => {
    render(
      <TimeIncrementSelector
        setTimeIncrement={mockSetTimeIncrement}
        timeIncrement={WEEK}
      />,
    );

    const menu = screen.getByTestId('menu');
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveAttribute(
      'data-menu-class',
      'py-2 pl-0 w-[6.25rem] rounded-lg flex flex-col list-none bg-white dark:bg-gray-700 shadow-panel z-10',
    );
  });

  test('renders MenuButton with correct text and styling', () => {
    render(
      <TimeIncrementSelector
        setTimeIncrement={mockSetTimeIncrement}
        timeIncrement={WEEK}
      />,
    );

    const menuButton = screen.getByTestId('menu-button-component');
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveClass(
      'flex',
      'items-center',
      'border-0',
      'bg-white',
      'p-2',
      'text-sm',
      'text-black',
      'dark:bg-gray-800',
      'dark:text-gray-100',
    );

    // Check that the button contains both text and icon
    expect(menuButton).toHaveTextContent('Week⬇️');
  });

  test('renders chevron down icon with correct styling', () => {
    render(
      <TimeIncrementSelector
        setTimeIncrement={mockSetTimeIncrement}
        timeIncrement={DAY}
      />,
    );

    const chevronIcon = screen.getByTestId('chevron-down-icon');
    expect(chevronIcon).toBeInTheDocument();
    expect(chevronIcon).toHaveClass('ml-2');
  });

  test('renders all menu items with correct values and text', () => {
    render(
      <TimeIncrementSelector
        setTimeIncrement={mockSetTimeIncrement}
        timeIncrement={MONTH}
      />,
    );

    const menuItems = screen.getAllByTestId('menu-item');
    expect(menuItems).toHaveLength(4);

    // Check that all menu items have correct data-value attributes
    expect(menuItems[0]).toHaveAttribute('data-value', DAY);
    expect(menuItems[1]).toHaveAttribute('data-value', WEEK);
    expect(menuItems[2]).toHaveAttribute('data-value', MONTH);
    expect(menuItems[3]).toHaveAttribute('data-value', YEAR);

    // Check that timeIncrementToText was called for all items
    expect(timeIncrementToText).toHaveBeenCalledWith(DAY, false);
    expect(timeIncrementToText).toHaveBeenCalledWith(WEEK, false);
    expect(timeIncrementToText).toHaveBeenCalledWith(MONTH, false);
    expect(timeIncrementToText).toHaveBeenCalledWith(YEAR, false);
  });

  test('menu items have correct CSS classes', () => {
    render(
      <TimeIncrementSelector
        setTimeIncrement={mockSetTimeIncrement}
        timeIncrement={DAY}
      />,
    );

    const menuItems = screen.getAllByTestId('menu-item');
    const expectedClasses =
      'font-normal text-sm text-black dark:text-gray-100 px-4 py-1.5 list-none cursor-pointer hover:bg-[#eee] dark:hover:bg-gray-500';

    menuItems.forEach((item) => {
      expect(item).toHaveClass(...expectedClasses.split(' '));
    });
  });

  test('calls timeIncrementToText with correct parameters for button text', () => {
    render(
      <TimeIncrementSelector
        setTimeIncrement={mockSetTimeIncrement}
        timeIncrement={YEAR}
      />,
    );

    expect(timeIncrementToText).toHaveBeenCalledWith(YEAR, false);
  });

  test('calls timeIncrementToText for each menu item', () => {
    render(
      <TimeIncrementSelector
        setTimeIncrement={mockSetTimeIncrement}
        timeIncrement={DAY}
      />,
    );

    expect(timeIncrementToText).toHaveBeenCalledWith(DAY, false); // Button text
    expect(timeIncrementToText).toHaveBeenCalledWith(DAY, false); // Menu item
    expect(timeIncrementToText).toHaveBeenCalledWith(WEEK, false);
    expect(timeIncrementToText).toHaveBeenCalledWith(MONTH, false);
    expect(timeIncrementToText).toHaveBeenCalledWith(YEAR, false);
    expect(timeIncrementToText).toHaveBeenCalledTimes(5);
  });

  test('clicking menu item calls setTimeIncrement with correct value', () => {
    render(
      <TimeIncrementSelector
        setTimeIncrement={mockSetTimeIncrement}
        timeIncrement={DAY}
      />,
    );

    const menuItems = screen.getAllByTestId('menu-item');

    // Click the WEEK menu item
    const [, weekItem] = menuItems;
    if (weekItem) fireEvent.click(weekItem);
    expect(mockSetTimeIncrement).toHaveBeenCalledWith(WEEK);
  });

  test('clicking different menu items calls setTimeIncrement with respective values', () => {
    render(
      <TimeIncrementSelector
        setTimeIncrement={mockSetTimeIncrement}
        timeIncrement={DAY}
      />,
    );

    const menuItems = screen.getAllByTestId('menu-item');

    // Click MONTH item
    const [, , monthItem] = menuItems;
    if (monthItem) fireEvent.click(monthItem);
    expect(mockSetTimeIncrement).toHaveBeenCalledWith(MONTH);

    // Click YEAR item
    const [, , , yearItem] = menuItems;
    if (yearItem) fireEvent.click(yearItem);
    expect(mockSetTimeIncrement).toHaveBeenCalledWith(YEAR);

    expect(mockSetTimeIncrement).toHaveBeenCalledTimes(2);
  });

  test('button text changes based on current timeIncrement prop', () => {
    const { rerender } = render(
      <TimeIncrementSelector
        setTimeIncrement={mockSetTimeIncrement}
        timeIncrement={DAY as unknown as number}
      />,
    );

    expect(screen.getByTestId('menu-button-component')).toHaveTextContent(
      'Day⬇️',
    );

    // Rerender with different timeIncrement
    rerender(
      <TimeIncrementSelector
        setTimeIncrement={mockSetTimeIncrement}
        timeIncrement={MONTH as unknown as number}
      />,
    );

    expect(screen.getByTestId('menu-button-component')).toHaveTextContent(
      'Month⬇️',
    );
  });

  test('handles edge case of undefined timeIncrement', () => {
    render(
      <TimeIncrementSelector
        setTimeIncrement={mockSetTimeIncrement}
        timeIncrement={undefined as unknown as number}
      />,
    );

    const menuButton = screen.getByTestId('menu-button-component');
    expect(menuButton).toBeInTheDocument();
    // Should still render without crashing
  });

  test('renders with correct structure hierarchy', () => {
    const { container } = render(
      <TimeIncrementSelector
        setTimeIncrement={mockSetTimeIncrement}
        timeIncrement={WEEK}
      />,
    );

    // Check structure: div.TimeIncrementSelector > Menu > MenuButton + MenuItems
    const timeIncrementSelector = container.querySelector(
      '.TimeIncrementSelector',
    );
    const menu = screen.getByTestId('menu');
    const menuButton = screen.getByTestId('menu-button-component');
    const menuItems = screen.getByTestId('menu-items');

    if (timeIncrementSelector) {
      expect(timeIncrementSelector).toContainElement(menu);
    }
    expect(menu).toContainElement(menuButton);
    expect(menu).toContainElement(menuItems);
  });

  test('menu button contains both text and icon', () => {
    render(
      <TimeIncrementSelector
        setTimeIncrement={mockSetTimeIncrement}
        timeIncrement={DAY}
      />,
    );

    const menuButton = screen.getByTestId('menu-button-component');
    const chevronIcon = screen.getByTestId('chevron-down-icon');

    expect(menuButton).toHaveTextContent('Day⬇️');
    expect(menuButton).toContainElement(chevronIcon);
  });

  test('renders correctly with all four time increment options', () => {
    const timeIncrements = [DAY, WEEK, MONTH, YEAR];

    timeIncrements.forEach((timeIncrement: string) => {
      const { rerender } = render(
        <TimeIncrementSelector
          setTimeIncrement={mockSetTimeIncrement}
          timeIncrement={timeIncrement as unknown as number}
        />,
      );

      const menuButton = screen.getByTestId('menu-button-component');
      const expectedText =
        timeIncrement.charAt(0).toUpperCase() + timeIncrement.slice(1);
      expect(menuButton).toHaveTextContent(`${expectedText}⬇️`);

      rerender(<div />); // Clean up
    });
  });

  test('menu items are clickable and interactive', () => {
    render(
      <TimeIncrementSelector
        setTimeIncrement={mockSetTimeIncrement}
        timeIncrement={WEEK}
      />,
    );

    const menuItems = screen.getAllByTestId('menu-item');

    // Test that each menu item has cursor-pointer class indicating it's clickable
    menuItems.forEach((item) => {
      expect(item).toHaveClass('cursor-pointer');
    });
  });
});
