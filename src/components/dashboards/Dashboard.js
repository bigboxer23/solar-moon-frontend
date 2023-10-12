import React, { useEffect, useState } from "react";
import { getDevices } from "../../services/services";
import { noSite } from "../sites/SiteManagement";
import { Card, CardBody, CardHeader, Dropdown } from "react-bootstrap";
import TimeSeries from "../Home/TimeSeries";
import { useStickyState } from "../../utils/Utils";
import PeriodToggle from "../common/PeriodToggle";
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
      <Card className={"site-attributes"}>
        <CardHeader className={"d-flex align-items-center"}>
          <div className={"flex-grow-1 fs-3"}>{activeSite}</div>
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
          <PeriodToggle time={time} setTime={setTime} />
        </CardHeader>
        <CardBody>
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
        </CardBody>
      </Card>
    </div>
  );
};

export default Dashboard;
