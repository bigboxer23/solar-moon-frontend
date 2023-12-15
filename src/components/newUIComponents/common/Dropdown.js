import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import classNames from 'classnames';
import { FaChevronDown } from 'react-icons/fa';

export default function Dropdown({
  prefixLabel,
  options,
  onChange,
  value,
  className,
}) {
  const dropdownClass = classNames('Dropdown', className);

  return (
    <div className={dropdownClass}>
      <Menu
        gap={8}
        menuButton={
          <MenuButton className='border-1 flex items-center rounded-full border-solid border-border-color bg-white px-4 py-1 text-black'>
            {prefixLabel && (
              <span className='mr-2 font-bold'>{prefixLabel}:</span>
            )}
            {value.label}
            <FaChevronDown className='ml-2' size='14' />
          </MenuButton>
        }
        menuClassName='pl-0 py-2 w-[9rem] rounded-lg flex flex-col list-none bg-white shadow-panel'
      >
        {options.map((option) => (
          <MenuItem
            className='cursor-pointer list-none px-4 py-1.5 text-sm font-normal text-black hover:bg-[#eee]'
            key={option.value}
            onClick={(e) => onChange(option)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
