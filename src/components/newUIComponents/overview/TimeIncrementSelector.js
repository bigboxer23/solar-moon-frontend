import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import { FaChevronDown } from "react-icons/fa";

export default function TimeIncrementSelector({
  timeIncrement,
  setTimeIncrement,
}) {
  const timeIncrementToText = (timeIncrement) => {
    switch (timeIncrement) {
      case "day":
        return "Day";
      case "week":
        return "Week";
      case "month":
        return "Month";
      case "year":
        return "Year";
      default:
        return "Day";
    }
  };

  return (
    <div className="TimeIncrementSelector">
      <Menu
        menuClassName="time-selector-menu"
        menuButton={
          <MenuButton className="time-selector-button">
            {timeIncrementToText(timeIncrement)}
            <FaChevronDown className="time-selector-icon" />
          </MenuButton>
        }
        onItemClick={({ value }) => setTimeIncrement(value)}
      >
        <MenuItem className="time-selector-menu-item" value="day">
          Day
        </MenuItem>
        <MenuItem className="time-selector-menu-item" value="week">
          Week
        </MenuItem>
        <MenuItem className="time-selector-menu-item" value="month">
          Month
        </MenuItem>
        <MenuItem className="time-selector-menu-item" value="year">
          Year
        </MenuItem>
      </Menu>
    </div>
  );
}
