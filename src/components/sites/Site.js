import { useState } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { AiOutlineDelete } from 'react-icons/ai';

import { deleteDevice } from '../../services/services';
import { sortDevices } from '../../utils/Utils';
import Device from './Device';
import SiteAttributes from './SiteAttributes';
import { noSite } from './SiteManagement';

const Site = ({ data, devices, setDevices, setActiveSite }) => {
  const [site] = useState(data);
  const [deleteSiteWarning, setDeleteSiteWarning] = useState(false);
  const removeSite = () => {
    let button = document.getElementById('delete' + site.id);
    button.classList.add('disabled');
    deleteDevice(site.id)
      .then(() => {
        setDevices((d) => d.filter((device) => device.id !== site.id));
        setActiveSite(noSite);
        button.classList.remove('disabled');
      })
      .catch((e) => {
        console.log(e);
        button.classList.remove('disabled');
      });
  };
  return (
    <div>
      {devices
        .filter((device) => device.virtual)
        .filter((device) => device.site === site.name)
        .map((device) => {
          return (
            <SiteAttributes
              data={device}
              key={device.id}
              setActiveSite={setActiveSite}
              setDevices={setDevices}
            />
          );
        })}
      {devices
        .filter((device) => device.site === site.name)
        .filter((device) => !device.virtual)
        .sort(sortDevices)
        .map((device) => {
          return (
            <Device
              data={device}
              devices={devices}
              key={device.id + device.site}
              setDevices={setDevices}
            />
          );
        })}
      {site.id === noSite ? (
        ''
      ) : (
        <Button
          className='ms-2 mt-3'
          id={'delete' + site.id}
          onClick={() => setDeleteSiteWarning(true)}
          variant='danger'
        >
          <Spinner
            animation='border'
            as='span'
            className='d-none me-2'
            role='status'
            size='sm'
          />
          <AiOutlineDelete className='button-icon' />
          Delete Site
        </Button>
      )}
      <Alert className='mt-3' show={deleteSiteWarning} variant='danger'>
        <p>Are you sure you want to delete this site?</p>
        <hr />
        <div className='d-flex justify-content-end'>
          <Button
            onClick={() => setDeleteSiteWarning(false)}
            variant='outline-secondary'
          >
            Cancel
          </Button>
          <Button
            className='ms-2'
            onClick={() => {
              setDeleteSiteWarning(false);
              removeSite();
            }}
            variant='outline-danger'
          >
            Delete Site
          </Button>
        </div>
      </Alert>
    </div>
  );
};
export default Site;
