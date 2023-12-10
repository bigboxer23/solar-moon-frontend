import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import { FaChevronDown } from "react-icons/fa";
import { DAY, MONTH, WEEK, YEAR } from "../../../services/search";
import { timeIncrementToText } from "../../../utils/Utils";

export default function TimeIncrementSelector({
  timeIncrement,
  setTimeIncrement,
}) {
  return (
    <div className="TimeIncrementSelector">
      <Menu
        menuClassName="time-selector-menu"
        menuButton={
          <MenuButton className="time-selector-button">
            {timeIncrementToText(timeIncrement, false)}
            <FaChevronDown className="time-selector-icon" />
          </MenuButton>
        }
        onItemClick={({ value }) => setTimeIncrement(value)}
      >
        <MenuItem className="time-selector-menu-item" value={DAY}>
          {timeIncrementToText(DAY, false)}
        </MenuItem>
        <MenuItem className="time-selector-menu-item" value={WEEK}>
          {timeIncrementToText(WEEK, false)}
        </MenuItem>
        <MenuItem className="time-selector-menu-item" value={MONTH}>
          {timeIncrementToText(MONTH, false)}
        </MenuItem>
        <MenuItem className="time-selector-menu-item" value={YEAR}>
          {timeIncrementToText(YEAR, false)}
        </MenuItem>
      </Menu>
    </div>
  );
}
