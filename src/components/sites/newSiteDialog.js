import { Button, Form, Modal, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import { addDevice } from "../../services/services";

const NewSiteDialog = ({ show, setShow, setDevices }) => {
  const [site, setSite] = useState({ virtual: true, name: "" });
  const createNewSite = (button) => {
    if (site.name !== "") {
      button.classList.add("disabled");
      addDevice(site)
        .then(({ data }) => {
          setDevices((devices) => [...devices, data]);
          setSite("");
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
        <Modal.Title>Create New Site</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={site.name}
              onChange={(e) => setSite({ ...site, name: e.target.value })}
              autoFocus
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={(e) => createNewSite(e.target)}>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            className={"me-2 d-none"}
          />
          Create Site
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default NewSiteDialog;
