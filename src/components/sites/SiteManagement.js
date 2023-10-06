import { Text } from "@aws-amplify/ui-react";
import React, { useEffect, useState } from "react";
import { getDevices } from "../../services/services";
import { Card, Form } from "react-bootstrap";
import Device from "./Device";
const SiteManagement = () => {
  const [devices, setDevices] = useState([]);
  const [noDevices, setNoDevices] = useState("");
  useEffect(() => {
    getDevices()
      .then(({ data }) => {
        setDevices(data);
      })
      .catch((e) => {
        console.log(e);
        setNoDevices(e.response.data);
      });
  }, []);

  const deviceUI = devices.map((device) => {
    return <Device key={device.id} data={device} setDevices={setDevices} />;
  });

  return (
    <div className={"root-page container"}>
      {deviceUI}
      <Card className={"m-5 " + (noDevices.length > 0 ? "" : "d-none")}>
        <Card.Body>{noDevices}</Card.Body>
      </Card>
    </div>
  );
};

export default SiteManagement;
