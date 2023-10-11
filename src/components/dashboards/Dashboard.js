import React, { useEffect, useState } from "react";
import { getDevices } from "../../services/services";
import { noSite } from "../sites/SiteManagement";
import {
  Card,
  CardHeader,
  Dropdown,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import TimeSeries from "../Home/TimeSeries";
import { useStickyState } from "../../utils/Utils";
import { DAY, HOUR, MONTH, WEEK } from "../../services/search";
const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [activeSite, setActiveSite] = useStickyState(noSite, "dashboard.site");
  const [time, setTime] = useStickyState("D", "dashboard.time");

  useEffect(() => {
    getDevices()
      .then(({ data }) => {
        setDevices(data);
        if (activeSite === "") {
          setActiveSite(data.find((device) => device.virtual)?.name || noSite);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <div className={"root-page container d-flex flex-column"}>
      <h3 className={"d-flex fw-bold header mb-0 align-items-center"}>
        <div className={"flex-grow-1"}>{activeSite}</div>
        <ToggleButtonGroup
          type="radio"
          name="time-period"
          value={time}
          onChange={(t) => setTime(t)}
          className={"me-3"}
        >
          <ToggleButton
            variant="secondary"
            name="time-period"
            id="tbg-btn-1"
            value={HOUR}
          >
            Hr
          </ToggleButton>
          <ToggleButton
            variant="secondary"
            name="time-period"
            id="tbg-btn-2"
            value={DAY}
          >
            D
          </ToggleButton>
          <ToggleButton
            variant="secondary"
            name="time-period"
            id="tbg-btn-3"
            value={WEEK}
          >
            Wk
          </ToggleButton>
          <ToggleButton
            variant="secondary"
            name="time-period"
            id="tbg-btn-4"
            value={MONTH}
          >
            Mo
          </ToggleButton>
        </ToggleButtonGroup>
        <Dropdown className={"align-self-end"}>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Choose Site
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {devices
              .filter((device) => device.virtual)
              .map((site) => {
                return (
                  <Dropdown.Item
                    as="button"
                    key={site.name + time}
                    onClick={() => setActiveSite(site.name)}
                  >
                    {site.name}
                  </Dropdown.Item>
                );
              })}
            <Dropdown.Item
              as="button"
              key={"none"}
              onClick={() => setActiveSite(noSite)}
            >
              {noSite}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </h3>
      <Card className={"site-attributes"}>
        <CardHeader>
          {devices
            .filter((device) => device.virtual)
            .filter((device) => device.site === activeSite)
            .map((device) => {
              return <TimeSeries key={device.id} device={device} time={time} />;
            })}
          {devices
            .filter((device) => !device.virtual)
            .filter((device) => device.site === activeSite)
            .sort((d1, d2) => d1.name.localeCompare(d2.name))
            .map((device) => {
              return <TimeSeries key={device.id} device={device} time={time} />;
            })}
        </CardHeader>
      </Card>
    </div>
  );
};

export default Dashboard;
