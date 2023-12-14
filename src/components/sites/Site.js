import { Alert, Button, Spinner } from 'react-bootstrap';
import { useState } from 'react';
import Device from './Device';
import { AiOutlineDelete } from 'react-icons/ai';
import { deleteDevice } from '../../services/services';
import { noSite } from './SiteManagement';
import SiteAttributes from './SiteAttributes';
import { sortDevices } from '../../utils/Utils';

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
              key={device.id}
              data={device}
              setDevices={setDevices}
              setActiveSite={setActiveSite}
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
              key={device.id + device.site}
              data={device}
              devices={devices}
              setDevices={setDevices}
            />
          );
        })}
      {site.id === noSite ? (
        ''
      ) : (
        <Button
          onClick={() => setDeleteSiteWarning(true)}
          variant='danger'
          className='ms-2 mt-3'
          id={'delete' + site.id}
        >
          <Spinner
            as='span'
            animation='border'
            size='sm'
            role='status'
            className='d-none me-2'
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
            onClick={() => {
              setDeleteSiteWarning(false);
              removeSite();
            }}
            variant='outline-danger'
            className='ms-2'
          >
            Delete Site
          </Button>
        </div>
      </Alert>
    </div>
  );
};
export default Site;
