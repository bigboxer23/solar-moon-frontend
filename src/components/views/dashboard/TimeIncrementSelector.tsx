import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import type { ReactElement } from 'react';
import { FaChevronDown } from 'react-icons/fa';

import { DAY, MONTH, WEEK, YEAR } from '../../../services/search';
import { timeIncrementToText } from '../../../utils/Utils';

interface TimeIncrementSelectorProps {
  timeIncrement: number;
  setTimeIncrement: (value: number) => void;
}

export default function TimeIncrementSelector({
  timeIncrement,
  setTimeIncrement,
}: TimeIncrementSelectorProps): ReactElement {
  const menuItemClass =
    'font-normal text-sm text-black dark:text-gray-100 px-4 py-1.5 list-none cursor-pointer hover:bg-[#eee] dark:hover:bg-gray-500';

  return (
    <div className='TimeIncrementSelector'>
      <Menu
        menuButton={
          <MenuButton className='flex items-center border-0 bg-white p-2 text-sm text-black dark:bg-gray-800 dark:text-gray-100'>
            {timeIncrementToText(timeIncrement, false)}
            <FaChevronDown className='ml-2' />
          </MenuButton>
        }
        menuClassName='py-2 pl-0 w-[6.25rem] rounded-lg flex flex-col list-none bg-white dark:bg-gray-700 shadow-panel z-10'
        onItemClick={({ value }) => setTimeIncrement(value as number)}
      >
        <MenuItem className={menuItemClass} value={DAY}>
          {timeIncrementToText(DAY, false)}
        </MenuItem>
        <MenuItem className={menuItemClass} value={WEEK}>
          {timeIncrementToText(WEEK, false)}
        </MenuItem>
        <MenuItem className={menuItemClass} value={MONTH}>
          {timeIncrementToText(MONTH, false)}
        </MenuItem>
        <MenuItem className={menuItemClass} value={YEAR}>
          {timeIncrementToText(YEAR, false)}
        </MenuItem>
      </Menu>
    </div>
  );
}
