import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { FaChevronDown } from "react-icons/fa";
import classNames from "classnames";

export default function Dropdown({
  prefixLabel,
  options,
  onChange,
  value,
  className,
}) {
  const dropdownClass = classNames("Dropdown", className);

  return (
    <div className={dropdownClass}>
      <Menu
        gap={8}
        menuButton={
          <MenuButton className="bg-white text-black border-1 border-solid border-border-color rounded-full px-4 py-1 flex items-center">
            {prefixLabel && (
              <span className="font-bold mr-2">{prefixLabel}:</span>
            )}
            {value.label}
            <FaChevronDown size="14" className="ml-2" />
          </MenuButton>
        }
        menuClassName="pl-0 py-2 w-[9rem] rounded-lg flex flex-col list-none bg-white shadow-panel"
      >
        {options.map((option) => (
          <MenuItem
            className="font-normal text-sm text-black px-4 py-1.5 list-none cursor-pointer hover:bg-[#eee]"
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
