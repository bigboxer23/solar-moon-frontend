import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import React, { useState } from "react";

import { AiOutlineDelete } from "react-icons/ai";
import { deleteDevice, updateDevice } from "../../services/services";

const Device = ({ data, devices, setDevices }) => {
  const [device, setDevice] = useState(data);
  const [deleteDeviceWarning, setDeleteDeviceWarning] = useState(false);

  const update = () => {
    if (device.deviceName === "") {
      return;
    }
    applyLoadingState(true);
    updateDevice(device)
      .then(({ data }) => {
        setDevice(data);
        setDevices([...devices.filter((d) => d.id !== data.id), data]);
        applyLoadingState(false);
      })
      .catch((e) => {
        console.log(e);
        applyLoadingState(false);
      });
  };

  const applyLoadingState = (state) => {
    if (state) {
      document.getElementById(device.id + "delete").classList.add("disabled");
      document.getElementById(device.id + "update").classList.add("disabled");
    } else {
      document
        .getElementById(device.id + "delete")
        .classList.remove("disabled");
      document
        .getElementById(device.id + "update")
        .classList.remove("disabled");
    }
  };
  const removeDevice = () => {
    applyLoadingState(true);
    deleteDevice(device.id)
      .then((data) => {
        setDevices((devices) => devices.filter((d) => d.id !== device.id));
      })
      .catch((e) => {
        console.log(e);
        applyLoadingState(false);
      });
  };

  return (
    <Card className={(device.disabled ? "opacity-50 " : "") + "mt-3 device"}>
      <Card.Header className={"fw-bold d-flex"}>
        {device.name}
        <div className={"flex-grow-1"} />
        <div
          title={
            "Disable this device. Alerting will not trigger and device will not be included in site roll up."
          }
        >
          <Form.Check
            type={"switch"}
            id={device.id + `disable`}
            checked={!device.disabled}
            onChange={(e) => {
              applyLoadingState(true);
              setDevice({ ...device, disabled: !device.disabled });
              updateDevice({ ...device, disabled: !device.disabled })
                .then(({ data }) => {
                  setDevice(data);
                  setDevices([
                    ...devices.filter((d) => d.id !== data.id),
                    data,
                  ]);
                  applyLoadingState(false);
                })
                .catch((e) => {
                  console.log(e);
                  applyLoadingState(false);
                });
            }}
          />
        </div>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formTechnicalName">
            <Form.Label>Device Name</Form.Label>
            <Form.Control
              placeholder="Device Name"
              value={device.deviceName || ""}
              onChange={(e) =>
                setDevice({ ...device, deviceName: e.target.value })
              }
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  update();
                }
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDisplayName">
            <Form.Label>Display Name</Form.Label>
            <Form.Control
              placeholder="Display Name"
              value={device.name || ""}
              onChange={(e) => setDevice({ ...device, name: e.target.value })}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  update();
                }
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDisplayName">
            <Form.Label>Site</Form.Label>
            <Form.Select
              aria-label="site select"
              value={device.site}
              onChange={(e) => setDevice({ ...device, site: e.target.value })}
            >
              {devices
                .filter((d) => d.virtual)
                .map((site) => {
                  return (
                    <option key={site.name} value={site.name}>
                      {site.name}
                    </option>
                  );
                })}
            </Form.Select>
          </Form.Group>
          <div className={"fw-bold d-flex align-items-center"}>
            <Button
              variant="primary"
              type="button"
              onClick={() => update()}
              id={device.id + "update"}
            >
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                className={"me-2 d-none"}
              />
              Update Device
            </Button>
            <div className={"flex-grow-1"} />
            <Button
              title={"Delete Device"}
              type={"button"}
              variant={"outline-danger"}
              className={"ms-2 w-auto position-relative"}
              id={device.id + "delete"}
              onClick={() => setDeleteDeviceWarning(true)}
            >
              <AiOutlineDelete style={{ marginBottom: "2px" }} />
            </Button>
          </div>
        </Form>
        <Alert show={deleteDeviceWarning} variant="danger" className={"mt-3"}>
          <p>Are you sure you want to delete this device?</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button
              onClick={() => setDeleteDeviceWarning(false)}
              variant="outline-secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setDeleteDeviceWarning(false);
                removeDevice();
              }}
              variant="outline-danger"
              className={"ms-2"}
            >
              <AiOutlineDelete className={"button-icon"} />
              Delete Device
            </Button>
          </div>
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default Device;
