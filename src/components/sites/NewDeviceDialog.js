import { useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';

import { addDevice } from '../../services/services';
import { preventSubmit } from '../../utils/Utils';

const NewDeviceDialog = ({
  show,
  setShow,
  devices,
  setDevices,
  setVersion,
  site,
}) => {
  const [device, setDevice] = useState({ site: site, deviceName: '' });

  const createNewDevice = () => {
    if (device.deviceName !== '') {
      let button = document.getElementById('createDevice');
      button.classList.add('disabled');
      addDevice(device)
        .then(({ data }) => {
          setDevices((devices) => [...devices, data]);
          setVersion((v) => v + 1);
          setShow(false);
        })
        .catch((e) => {
          button.classList.remove('disabled');
          console.log(e);
        });
    }
  };
  const handleClose = () => setShow(false);
  return (
    <Modal data-bs-theme='dark' onHide={handleClose} show={show}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Device</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className='mb-3' controlId='formTechnicalName'>
            <Form.Label>Device Name</Form.Label>
            <Form.Control
              autoFocus
              onChange={(e) =>
                setDevice({ ...device, deviceName: e.target.value })
              }
              onKeyPress={preventSubmit}
              onKeyUp={(event) => {
                if (event.key === 'Enter') {
                  createNewDevice();
                }
              }}
              placeholder='Device Name'
              value={device.deviceName || ''}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='formDisplayName'>
            <Form.Label>Display Name</Form.Label>
            <Form.Control
              onChange={(e) => setDevice({ ...device, name: e.target.value })}
              onKeyPress={preventSubmit}
              onKeyUp={(event) => {
                if (event.key === 'Enter') {
                  createNewDevice();
                }
              }}
              placeholder='Display Name'
              value={device.name || ''}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='formDisplayName'>
            <Form.Label>Site</Form.Label>
            <Form.Select
              aria-label='site select'
              onChange={(e) => setDevice({ ...device, site: e.target.value })}
              value={device.site}
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
          id='createDevice'
          onClick={() => createNewDevice()}
          variant='primary'
        >
          <Spinner
            animation='border'
            as='span'
            className='d-none me-2'
            role='status'
            size='sm'
          />
          Create Device
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default NewDeviceDialog;
