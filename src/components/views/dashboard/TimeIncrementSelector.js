import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { FaChevronDown } from 'react-icons/fa';

import { DAY, MONTH, WEEK, YEAR } from '../../../services/search';
import { timeIncrementToText } from '../../../utils/Utils';

export default function TimeIncrementSelector({
  timeIncrement,
  setTimeIncrement,
}) {
  const menuItemClass =
    'font-normal text-sm text-black px-4 py-1.5 list-none cursor-pointer hover:bg-[#eee]';

  return (
    <div className='TimeIncrementSelector'>
      <Menu
        menuButton={
          <MenuButton className='flex items-center border-0 bg-white p-2 text-sm text-black'>
            {timeIncrementToText(timeIncrement, false)}
            <FaChevronDown className='ml-2' />
          </MenuButton>
        }
        menuClassName='py-2 pl-0 w-[6.25rem] rounded-lg flex flex-col list-none bg-white shadow-panel z-10'
        onItemClick={({ value }) => setTimeIncrement(value)}
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
