import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import { FaChevronDown } from "react-icons/fa";
import { DAY, MONTH, WEEK, YEAR } from "../../../services/search";
import { timeIncrementToText } from "../../../utils/Utils";

export default function TimeIncrementSelector({
  timeIncrement,
  setTimeIncrement,
}) {
  const menuItemClass =
    "font-normal text-sm text-black px-4 py-1.5 list-none cursor-pointer hover:bg-[#eee]";

  return (
    <div className="TimeIncrementSelector">
      <Menu
        menuClassName="py-2 pl-0 w-[6.25rem] rounded-lg flex flex-col list-none bg-white shadow-panel"
        menuButton={
          <MenuButton className="bg-white text-sm text-black p-2 border-0">
            {timeIncrementToText(timeIncrement, false)}
            <FaChevronDown className="ml-2" />
          </MenuButton>
        }
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
