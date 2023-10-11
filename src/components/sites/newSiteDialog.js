import { Button, Form, Modal, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import { addDevice } from "../../services/services";
import { preventSubmit } from "../../utils/Utils";

const NewSiteDialog = ({
  show,
  setShow,
  setDevices,
  setActiveSite,
  setVersion,
}) => {
  const [site, setSite] = useState({ virtual: true, name: "" });

  const createNewSite = () => {
    if (site.name !== "") {
      let button = document.getElementById("createSite");
      button.classList.add("disabled");
      addDevice(site)
        .then(({ data }) => {
          setDevices((devices) => [...devices, data]);
          setActiveSite(data.name);
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
        <Modal.Title>Create New Site</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={site.name}
              onChange={(e) =>
                setSite({ ...site, name: e.target.value, site: e.target.value })
              }
              onKeyPress={preventSubmit}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  createNewSite();
                }
              }}
              autoFocus
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          id="createSite"
          variant="primary"
          onClick={() => createNewSite()}
        >
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
