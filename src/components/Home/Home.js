import { useAuthenticator } from "@aws-amplify/ui-react";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import MetricsTile from "../graphs/MetricsTile";
import { getDevices } from "../../services/services";
import { useStickyState } from "../../utils/Utils";
import PeriodToggle from "../common/PeriodToggle";
import { DAY } from "../../services/search";

const Home = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [devices, setDevices] = useState([]);
  const [time, setTime] = useStickyState(DAY, "dashboard.time");

  useEffect(() => {
    getDevices()
      .then(({ data }) => {
        setDevices(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div className={"root-page container"}>
      <Card>
        <CardHeader className={"d-flex align-items-center"}>
          <div className={"welcome"}>Welcome {user.attributes.email}!</div>
          <div className={"flex-grow-1"} />
          <PeriodToggle time={time} setTime={setTime} />
        </CardHeader>
        <CardBody className={"d-flex justify-content-center flex-wrap"}>
          {devices.length === 0 ? <div className={"w-100 loading"}></div> : ""}
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
