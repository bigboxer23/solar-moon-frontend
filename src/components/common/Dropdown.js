import { Menu, MenuButton, MenuDivider, MenuItem } from '@szhsin/react-menu';
import classNames from 'classnames';
import { useController } from 'react-hook-form';
import { FaChevronDown } from 'react-icons/fa';

export default function Dropdown({
  prefixLabel,
  options = [],
  onChange,
  value = options?.[0],
  className,
}) {
  const dropdownClass = classNames('Dropdown', className);

  return (
    <div className={dropdownClass}>
      <Menu
        gap={8}
        menuButton={
          <MenuButton className='border-1 flex items-center rounded-full border-solid border-border-color bg-white text-black dark:bg-gray-800 dark:text-gray-100'>
            {prefixLabel && (
              <span className='mr-2 font-bold'>{prefixLabel}:</span>
            )}
            {value?.label}
            <FaChevronDown className='ml-2' size='14' />
          </MenuButton>
        }
        menuClassName='pl-0 py-2 w-[9rem] rounded-lg flex flex-col list-none bg-white dark:bg-gray-700 shadow-panel z-10'
      >
        {options.map((option) => {
          if (option.divider)
            return (
              <MenuDivider
                className='me-3 ms-3 h-px bg-[#eee]'
                key={option.value}
              />
            );
          return (
            <MenuItem
              className='flex cursor-pointer list-none items-center px-4 py-1.5 text-sm font-normal text-black hover:bg-[#eee] dark:text-gray-100 dark:hover:bg-gray-500'
              key={option.value}
              onClick={(e) => onChange(option)}
            >
              {option.icon !== undefined && option.icon}
              {option.label}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}

export function ControlledDropdown({ name, control, ...rest }) {
  const { field } = useController({ name, control });

  return <Dropdown onChange={field.onChange} {...rest} />;
}
