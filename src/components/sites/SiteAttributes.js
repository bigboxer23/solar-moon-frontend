import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import React, { useState } from "react";

import { getDevices, updateDevice } from "../../services/services";
import { preventSubmit } from "../../utils/Utils";

const SiteAttributes = ({ data, setDevices, setActiveSite }) => {
  const [device, setDevice] = useState(data);

  const update = () => {
    let target = document.getElementById("siteUpdate" + device.id);
    target.classList.add("disabled");

    updateDevice(maybeUpdateLocation())
      .then((d) => {
        setDevice(d.data);
        setActiveSite(device.name);
        //Fetch all new devices b/c site change cascades down to devices (potentially)
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

  const maybeUpdateLocation = () => {
    if (
      device.city !== null &&
      device.state !== null &&
      device.country !== null &&
      (device.city !== data.city ||
        device.state !== data.state ||
        device.country !== data.country)
    ) {
      return {
        ...device,
        latitude: -1,
        longitude: -1,
      };
    }
    return device;
  };

  const submit = (event) => {
    if (event.key === "Enter") {
      update();
    }
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
                  displayName: e.target.value,
                  site: e.target.value,
                })
              }
              onKeyPress={preventSubmit}
              onKeyUp={submit}
            />
          </Form.Group>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                value={device.city || ""}
                onChange={(e) =>
                  setDevice({
                    ...device,
                    city: e.target.value,
                  })
                }
                onKeyPress={preventSubmit}
                onKeyUp={submit}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>State, County, Province, or Region</Form.Label>
              <Form.Control
                value={device.state || ""}
                onChange={(e) =>
                  setDevice({
                    ...device,
                    state: e.target.value,
                  })
                }
                onKeyPress={preventSubmit}
                onKeyUp={submit}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control
                value={device.country || ""}
                onChange={(e) =>
                  setDevice({
                    ...device,
                    country: e.target.value,
                  })
                }
                onKeyPress={preventSubmit}
                onKeyUp={submit}
              />
            </Form.Group>
          </Row>
          <div
            className={
              (device.latitude !== -1 && device.longitude !== -1
                ? ""
                : "opacity-0 ") +
              "d-flex justify-content-end text-muted smaller-text"
            }
          >
            {device.latitude + "," + device.longitude}
          </div>
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
