import moment from "moment";
import classNames from "classnames";
import {
  formatMessage,
  getFormattedDaysHoursMinutes,
} from "../../../utils/Utils";

export default function Alert({ alert, active }) {
  const timeSinceAlert = moment(alert.startDate).fromNow();
  const timeSinceResolved = moment(alert.endDate).fromNow();
  const alertClass = classNames(
    "Alert flex w-full justify-between bg-[#f5f5f5] p-4 rounded-md",
    {
      "bg-[#fee2e2]": active,
    },
  );

  return (
    <div className={alertClass}>
      <div>
        <div className="flex justify-start">
          <div className="text-sm mr-3">
            <span className="font-bold mr-1.5">Device:</span>
            {alert.deviceName ? alert.deviceName : alert.deviceId}
          </div>
          {alert.deviceSite && (
            <div className="text-sm mr-3">
              <span className="font-bold mr-1.5">Site:</span>
              {alert.deviceSite}
            </div>
          )}
        </div>
        <div className="text-sm mr-3">
          <span className="font-bold mr-1.5">Message:</span>{" "}
          {formatMessage(alert.message)}
        </div>
      </div>
      <div>
        {alert.state === 1 && (
          <div className="flex justify-end text-xs italic m-0.5">
            {timeSinceAlert}
          </div>
        )}
        {alert.state === 0 && (
          <div className="flex flex-column justify-end text-xs italic m-0.5">
            <div>Resolved {timeSinceResolved}</div>
            <div>
              Duration{" "}
              {getFormattedDaysHoursMinutes(alert.endDate - alert.startDate)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
