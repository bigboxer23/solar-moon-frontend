import { Button, Form, Modal, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import { addDevice } from "../../services/services";
import { preventSubmit } from "../../utils/Utils";

const NewDeviceDialog = ({
  show,
  setShow,
  devices,
  setDevices,
  setVersion,
  site,
}) => {
  const [device, setDevice] = useState({ site: site, deviceName: "" });

  const createNewDevice = () => {
    if (device.deviceName !== "") {
      let button = document.getElementById("createDevice");
      button.classList.add("disabled");
      addDevice(device)
        .then(({ data }) => {
          setDevices((devices) => [...devices, data]);
          setVersion((v) => v + 1);
          setShow(false);
        })
        .catch((e) => {
          button.classList.remove("disabled");
          console.log(e);
        });
    }
  };
  const handleClose = () => setShow(false);
  return (
    <Modal show={show} onHide={handleClose} data-bs-theme="dark">
      <Modal.Header closeButton>
        <Modal.Title>Create New Device</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formTechnicalName">
            <Form.Label>Device Name</Form.Label>
            <Form.Control
              autoFocus
              placeholder="Device Name"
              value={device.deviceName || ""}
              onChange={(e) =>
                setDevice({ ...device, deviceName: e.target.value })
              }
              onKeyPress={preventSubmit}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  createNewDevice();
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
              onKeyPress={preventSubmit}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  createNewDevice();
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          id="createDevice"
          variant="primary"
          onClick={() => createNewDevice()}
        >
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            className={"me-2 d-none"}
          />
          Create Device
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default NewDeviceDialog;
