import moment from "moment";
import classNames from "classnames";

export default function Alert({ alert, active }) {
  const timeSinceAlert = moment(alert.startDate).fromNow();
  const timeSinceResolved = moment(alert.endDate).fromNow();
  const alertClass = classNames("Alert", {
    active: active,
  });

  return (
    <div className={alertClass}>
      <div>
        <div className="alert-labels">
          <div className="alert-info-item">
            <span className="alert-info-item-label">Device:</span>
            {alert.deviceName ? alert.deviceName : alert.deviceId}
          </div>
          {alert.deviceSite && (
            <div className="alert-info-item">
              <span className="alert-info-item-label">Site:</span>
              {alert.deviceSite}
            </div>
          )}
        </div>
        <div className="alert-info-item">
          <span className="alert-info-item-label">Message:</span>{" "}
          {alert.message}
        </div>
      </div>
      <div>
        {alert.state === 1 && (
          <div className="alert-time">{timeSinceAlert}</div>
        )}
        {alert.state === 0 && (
          <div className="alert-time">Resolved {timeSinceResolved}</div>
        )}
      </div>
    </div>
  );
}
