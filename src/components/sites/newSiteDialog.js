import { useState } from 'react';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';

import { addDevice } from '../../services/services';
import { onEnterPressed, preventSubmit } from '../../utils/Utils';

const NewSiteDialog = ({
  show,
  setShow,
  setDevices,
  setActiveSite,
  setVersion,
}) => {
  const [site, setSite] = useState({
    virtual: true,
    virtualIndex: 'true',
    name: '',
    city: '',
    state: '',
    country: '',
    latitude: -1,
    longitude: -1,
  });

  const createNewSite = () => {
    if (site.name !== '') {
      let button = document.getElementById('createSite');
      button.classList.add('disabled');
      addDevice(site)
        .then(({ data }) => {
          setDevices((devices) => [...devices, data]);
          setActiveSite(data.name);
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
    <Modal data-bs-theme='dark' onHide={handleClose} show={show} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Create New Site</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className='mb-3' controlId='formName'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              autoFocus
              onChange={(e) =>
                setSite({
                  ...site,
                  name: e.target.value,
                  deviceName: e.target.value,
                  site: e.target.value,
                })
              }
              onKeyPress={preventSubmit}
              onKeyUp={(event) => onEnterPressed(event, createNewSite)}
              value={site.name}
            />
          </Form.Group>
          <Row className='mb-3'>
            <Form.Group as={Col} controlId='formGridCity'>
              <Form.Label>City</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setSite({
                    ...site,
                    city: e.target.value,
                  })
                }
                onKeyPress={preventSubmit}
                onKeyUp={(event) => onEnterPressed(event, createNewSite)}
                value={site.city || ''}
              />
            </Form.Group>

            <Form.Group as={Col} controlId='formGridState'>
              <Form.Label>State, County, Province, or Region</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setSite({
                    ...site,
                    state: e.target.value,
                  })
                }
                onKeyPress={preventSubmit}
                onKeyUp={(event) => onEnterPressed(event, createNewSite)}
                value={site.state || ''}
              />
            </Form.Group>
          </Row>
          <Form.Group as={Col} controlId='formGridCountry'>
            <Form.Label>Country</Form.Label>
            <Form.Control
              onChange={(e) =>
                setSite({
                  ...site,
                  country: e.target.value,
                })
              }
              onKeyPress={preventSubmit}
              onKeyUp={(event) => onEnterPressed(event, createNewSite)}
              value={site.country || ''}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          id='createSite'
          onClick={() => createNewSite()}
          variant='primary'
        >
          <Spinner
            animation='border'
            as='span'
            className='d-none me-2'
            role='status'
            size='sm'
          />
          Create Site
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default NewSiteDialog;
