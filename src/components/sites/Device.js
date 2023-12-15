import { useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { AiOutlineDelete } from 'react-icons/ai';

import { deleteDevice, updateDevice } from '../../services/services';

const Device = ({ data, devices, setDevices }) => {
  const [device, setDevice] = useState(data);
  const [deleteDeviceWarning, setDeleteDeviceWarning] = useState(false);

  const update = () => {
    if (device.deviceName === '') {
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
        applyLoadingState(false);
      });
  };

  const applyLoadingState = (state) => {
    if (state) {
      document.getElementById(device.id + 'delete').classList.add('disabled');
      document.getElementById(device.id + 'update').classList.add('disabled');
    } else {
      document
        .getElementById(device.id + 'delete')
        .classList.remove('disabled');
      document
        .getElementById(device.id + 'update')
        .classList.remove('disabled');
    }
  };
  const removeDevice = () => {
    applyLoadingState(true);
    deleteDevice(device.id)
      .then(() => {
        setDevices((devices) => devices.filter((d) => d.id !== device.id));
      })
      .catch((e) => {
        console.log(e);
        applyLoadingState(false);
      });
  };

  return (
    <Card className='device mt-3'>
      <Card.Header className='fw-bold d-flex'>
        <div className={device.disabled ? 'opacity-50 ' : ''}>
          {device.name}
        </div>
        <div className='grow-1' />
        <div title='Disable this device. Alerting will not trigger and device will not be included in site roll up.'>
          <Form.Check
            checked={!device.disabled}
            className='hidden-without-hover'
            id={device.id + `disable`}
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
            type='switch'
          />
        </div>
      </Card.Header>
      <Card.Body className={device.disabled ? 'd-none' : ''}>
        <Form>
          <Form.Group className='mb-3' controlId='formTechnicalName'>
            <Form.Label>Device Name</Form.Label>
            <Form.Control
              onChange={(e) =>
                setDevice({ ...device, deviceName: e.target.value })
              }
              onKeyUp={(event) => {
                if (event.key === 'Enter') {
                  update();
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
              onKeyUp={(event) => {
                if (event.key === 'Enter') {
                  update();
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
          <Form.Group className='mb-3' controlId='formDisplayName'>
            <Form.Label>Notifications</Form.Label>
            <Form.Check
              checked={!device.notificationsDisabled}
              id={device.id + `notificationsDisabled`}
              onChange={(e) => {
                setDevice({
                  ...device,
                  notificationsDisabled: !device.notificationsDisabled,
                });
              }}
              type='switch'
            />
          </Form.Group>
          <div className='fw-bold d-flex align-items-center'>
            <Button
              className='hidden-without-hover'
              id={device.id + 'update'}
              onClick={() => update()}
              type='button'
              variant='primary'
            >
              <Spinner
                animation='border'
                as='span'
                className='d-none me-2'
                role='status'
                size='sm'
              />
              Update Device
            </Button>
            <div className='grow-1' />
            <Button
              className='position-relative hidden-without-hover ms-2 w-auto'
              id={device.id + 'delete'}
              onClick={() => setDeleteDeviceWarning(true)}
              title='Delete Device'
              type='button'
              variant='outline-danger'
            >
              <AiOutlineDelete style={{ marginBottom: '2px' }} />
            </Button>
          </div>
        </Form>
        <Alert className='mt-3' show={deleteDeviceWarning} variant='danger'>
          <p>Are you sure you want to delete this device?</p>
          <hr />
          <div className='d-flex justify-content-end'>
            <Button
              onClick={() => setDeleteDeviceWarning(false)}
              variant='outline-secondary'
            >
              Cancel
            </Button>
            <Button
              className='ms-2'
              onClick={() => {
                setDeleteDeviceWarning(false);
                removeDevice();
              }}
              variant='outline-danger'
            >
              <AiOutlineDelete className='button-icon' />
              Delete Device
            </Button>
          </div>
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default Device;
