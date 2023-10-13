import { Button, Card, Form, Spinner } from "react-bootstrap";
import React, { useState } from "react";

import { getDevices, updateDevice } from "../../services/services";
import { preventSubmit } from "../../utils/Utils";

const SiteAttributes = ({ data, setDevices, setActiveSite }) => {
  const [device, setDevice] = useState(data);

  const update = () => {
    let target = document.getElementById("siteUpdate" + device.id);
    target.classList.add("disabled");
    updateDevice(device)
      .then(({ newSite }) => {
        setActiveSite(device.name);
        getDevices().then(({ data }) => {
          setDevices(data);
          target.classList.remove("disabled");
        });
      })
      .catch((e) => {
        console.log(e);
        target.classList.remove("disabled");
      });
  };

  return (
    <Card className={"device site-attributes"}>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formDisplayName">
            <Form.Label>Display Name</Form.Label>
            <Form.Control
              placeholder="Display Name"
              value={device.name || ""}
              onChange={(e) =>
                setDevice({
                  ...device,
                  name: e.target.value,
                  site: e.target.value,
                })
              }
              onKeyPress={preventSubmit}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  update();
                }
              }}
            />
          </Form.Group>
          <div className={"fw-bold d-flex align-items-center"}>
            <Button
              variant="primary"
              type="button"
              id={"siteUpdate" + device.id}
              onClick={() => update()}
            >
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                className={"me-2 d-none"}
              />
              Update Site
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SiteAttributes;
