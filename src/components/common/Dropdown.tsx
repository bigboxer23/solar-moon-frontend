import { Menu, MenuButton, MenuDivider, MenuItem } from '@szhsin/react-menu';
import classNames from 'classnames';
import type { ReactElement, ReactNode } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { FaChevronDown } from 'react-icons/fa';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
  divider?: boolean;
}

export interface DropdownProps {
  prefixLabel?: string;
  options?: DropdownOption[];
  onChange: (option: DropdownOption) => void;
  value?: DropdownOption;
  className?: string;
}

export default function Dropdown({
  prefixLabel,
  options = [],
  onChange,
  value = options?.[0],
  className,
}: DropdownProps): ReactElement {
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
        menuClassName='pl-0 py-2 min-w-[9rem] max-w-[14rem] sm:max-w-[20rem] rounded-lg list-none bg-white dark:bg-gray-700 shadow-panel z-10 whitespace-nowrap text-ellipsis overflow-hidden block'
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
              className='block cursor-pointer list-none items-center truncate px-4 py-1.5 text-sm font-normal text-black hover:bg-[#eee] dark:text-gray-100 dark:hover:bg-gray-500'
              key={option.value}
              onClick={() => onChange(option)}
            >
              {option.icon !== undefined ? (
                <div className='flex items-center'>
                  {option.icon}
                  {option.label}
                </div>
              ) : (
                option.label
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}

export interface ControlledDropdownProps<
  TFieldValues extends FieldValues,
> extends Omit<DropdownProps, 'onChange'> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
}

export function ControlledDropdown<TFieldValues extends FieldValues>({
  name,
  control,
  ...rest
}: ControlledDropdownProps<TFieldValues>): ReactElement {
  const { field } = useController({ name, control });

  return <Dropdown onChange={field.onChange} {...rest} />;
}
