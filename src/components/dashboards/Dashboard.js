import React, { useEffect, useState } from "react";
import { getDevices } from "../../services/services";
import { noSite } from "../sites/SiteManagement";
import { Card, CardBody, CardHeader, Dropdown } from "react-bootstrap";
import TimeSeries from "../graphs/TimeSeries";
import { sortDevices, useStickyState } from "../../utils/Utils";
import PeriodToggle from "../common/PeriodToggle";
import { DAY } from "../../services/search";
import SiteGraph from "../graphs/SiteGraph";
import Loader from "../common/Loader";
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [activeSite, setActiveSite] = useStickyState(noSite, "dashboard.site");
  const [time, setTime] = useStickyState(DAY, "dashboard.time");

  useEffect(() => {
    getDevices()
      .then(({ data }) => {
        setDevices(data);
        setLoading(false);
        if (activeSite === noSite) {
          setActiveSite(data.find((device) => device.virtual)?.name || noSite);
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);
  return (
    <div className={"root-page container d-flex flex-column min-vh-95"}>
      <Card className={"site-attributes"}>
        <CardHeader className={"d-flex align-items-center flex-wrap"}>
          <div className={"fs-3 site-name"}>{activeSite}</div>
          <div className={"flex-grow-1"} />
          <Dropdown className={"align-self-end"}>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              {activeSite}
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
          <Loader
            loading={loading}
            deviceCount={devices.length}
            content={
              'You don\'t have any devices yet.  Add some by navigating to the "Sites" section above!'
            }
          />
          {devices
            .filter((device) => device.virtual)
            .filter((device) => device.site === activeSite)
            .map((device) => {
              return <SiteGraph key={device.id} site={device} time={time} />;
            })}
          {devices
            .filter((device) => !device.virtual)
            .filter((device) => device.site === activeSite)
            .sort(sortDevices)
            .map((device) => {
              return <TimeSeries key={device.id} device={device} time={time} />;
            })}
        </CardBody>
      </Card>
    </div>
  );
};

export default Dashboard;
