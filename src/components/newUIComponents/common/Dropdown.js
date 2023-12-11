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
        menuButton={
          <MenuButton className="dropdown-button">
            {prefixLabel && (
              <span className="dropdown-label">{prefixLabel}:</span>
            )}
            {value.label}
            <FaChevronDown size="14" className="dropdown-icon" />
          </MenuButton>
        }
        menuClassName="dropdown-menu-body"
      >
        {options.map((option) => (
          <MenuItem
            className="dropdown-item"
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
