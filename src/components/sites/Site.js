import { Button } from "react-bootstrap";
import React, { useState } from "react";
import Device from "./Device";
import { AiOutlineDelete } from "react-icons/ai";

const Site = ({ data, devices, setDevices }) => {
  const [site, setSite] = useState(data);

  const deviceUI = devices
    .filter((device) => device.site === site.name)
    .map((device) => {
      return <Device key={device.id} data={device} setDevices={setDevices} />;
    });

  return (
    <div>
      {deviceUI}
      <Button
        onClick={() => {
          //setDeleteAcctWarning(false);
          //updateCustomer({ ...customerData, active: false });
          //TODO:
        }}
        variant="danger"
        className={"ms-2"}
      >
        <AiOutlineDelete style={{ marginBottom: "2px", marginRight: "6px" }} />
        Delete Site
      </Button>
    </div>
  );
};
export default Site;
