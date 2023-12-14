import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { useState } from 'react';
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
    <Modal size='lg' show={show} onHide={handleClose} data-bs-theme='dark'>
      <Modal.Header closeButton>
        <Modal.Title>Create New Site</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className='mb-3' controlId='formName'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={site.name}
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
              autoFocus
            />
          </Form.Group>
          <Row className='mb-3'>
            <Form.Group as={Col} controlId='formGridCity'>
              <Form.Label>City</Form.Label>
              <Form.Control
                value={site.city || ''}
                onChange={(e) =>
                  setSite({
                    ...site,
                    city: e.target.value,
                  })
                }
                onKeyPress={preventSubmit}
                onKeyUp={(event) => onEnterPressed(event, createNewSite)}
              />
            </Form.Group>

            <Form.Group as={Col} controlId='formGridState'>
              <Form.Label>State, County, Province, or Region</Form.Label>
              <Form.Control
                value={site.state || ''}
                onChange={(e) =>
                  setSite({
                    ...site,
                    state: e.target.value,
                  })
                }
                onKeyPress={preventSubmit}
                onKeyUp={(event) => onEnterPressed(event, createNewSite)}
              />
            </Form.Group>
          </Row>
          <Form.Group as={Col} controlId='formGridCountry'>
            <Form.Label>Country</Form.Label>
            <Form.Control
              value={site.country || ''}
              onChange={(e) =>
                setSite({
                  ...site,
                  country: e.target.value,
                })
              }
              onKeyPress={preventSubmit}
              onKeyUp={(event) => onEnterPressed(event, createNewSite)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          id='createSite'
          variant='primary'
          onClick={() => createNewSite()}
        >
          <Spinner
            as='span'
            animation='border'
            size='sm'
            role='status'
            className='d-none me-2'
          />
          Create Site
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default NewSiteDialog;
