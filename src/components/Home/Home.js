import { useAuthenticator } from "@aws-amplify/ui-react";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import MetricsTile from "../graphs/MetricsTile";
import { getDevices } from "../../services/services";
import { useStickyState } from "../../utils/Utils";
import PeriodToggle from "../common/PeriodToggle";
import { DAY } from "../../services/search";
import Loader from "../common/Loader";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuthenticator((context) => [context.user]);
  const [devices, setDevices] = useState([]);
  const [time, setTime] = useStickyState(DAY, "dashboard.time");

  useEffect(() => {
    getDevices()
      .then(({ data }) => {
        setLoading(false);
        setDevices(data);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={"root-page container min-vh-95"}>
      <Card>
        <CardHeader className={"d-flex align-items-center"}>
          <div className={"welcome"}>Hello {user.attributes.email}!</div>
          <div className={"flex-grow-1"} />
          <PeriodToggle time={time} setTime={setTime} />
        </CardHeader>
        <CardBody className={"d-flex justify-content-center flex-wrap"}>
          <Loader
            loading={loading}
            deviceCount={devices.length}
            content={
              "You don't have any sites or devices yet.  Why don't you add some by clicking the sites link above?"
            }
          />
          {devices
            .filter((device) => device.virtual)
            .map((device) => {
              return (
                <MetricsTile key={device.id} device={device} time={time} />
              );
            })}
        </CardBody>
      </Card>
    </div>
  );
};

export default Home;
