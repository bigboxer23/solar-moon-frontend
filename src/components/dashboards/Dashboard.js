import React, { useEffect, useState } from "react";
import { getDevices } from "../../services/services";
import { noSite } from "../sites/SiteManagement";
import { Card, CardHeader, Dropdown } from "react-bootstrap";
import TimeSeries from "../Home/TimeSeries";
import { useStickyState } from "../../utils/Utils";
const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [activeSite, setActiveSite] = useStickyState(noSite, "dashboard.site");

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
      <h4 className={"d-flex fw-bold header mb-0 align-items-center"}>
        <div className={"flex-grow-1"}>Site: {activeSite}</div>
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
                    key={site.name}
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
      </h4>
      <Card className={"site-attributes"}>
        <CardHeader>
          {devices
            .filter((device) => device.virtual)
            .filter((device) => device.site === activeSite)
            .map((device) => {
              return (
                <TimeSeries
                  key={device.id}
                  device={device}
                  time={2 * 24 * 60 * 60 * 1000}
                />
              );
            })}
          {devices
            .filter((device) => !device.virtual)
            .filter((device) => device.site === activeSite)
            .sort((d1, d2) => d1.name.localeCompare(d2.name))
            .map((device) => {
              return (
                <TimeSeries
                  key={device.id}
                  device={device}
                  time={2 * 24 * 60 * 60 * 1000}
                />
              );
            })}
        </CardHeader>
      </Card>
    </div>
  );
};

export default Dashboard;
