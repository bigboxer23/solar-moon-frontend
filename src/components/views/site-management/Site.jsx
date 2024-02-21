import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';

import { deleteDevice, getDevices } from '../../../services/services';
import { sortDevices } from '../../../utils/Utils';
import AlertSection from '../../common/AlertSection';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';
import Device from './Device';
import SiteAttributes from './SiteAttributes';
import { noSite } from './SiteManagement';

const Site = ({ data, devices, setDevices, setActiveSiteId }) => {
  const [site] = useState(data);
  const [loading, setLoading] = useState(false);
  const [deleteSiteWarning, setDeleteSiteWarning] = useState(false);
  const removeSite = () => {
    setLoading(true);
    deleteDevice(site.id)
      .then(() => {
        getDevices().then(({ data }) => {
          setDevices(data);
          setActiveSiteId(noSite);
          setLoading(false);
        });
      })
      .catch((e) => {
        setLoading(false);
      });
  };
  return (
    <div className='space-y-6'>
      {devices
        .filter((device) => device.isSite)
        .filter((device) => device.site === site.name)
        .map((device) => {
          return (
            <SiteAttributes
              data={device}
              key={device.id}
              setActiveSiteId={setActiveSiteId}
              setDevices={setDevices}
            />
          );
        })}
      {devices
        .filter((device) => device.siteId === site.id)
        .filter((device) => !device.isSite)
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
      {site.id !== noSite && (
        <Button
          className='ms-auto mt-3'
          disabled={loading}
          onClick={() => setDeleteSiteWarning(true)}
          variant='danger'
        >
          {loading && <Spinner className='button-icon' />}
          <AiOutlineDelete className='button-icon' />
          Delete Site
        </Button>
      )}
      <AlertSection
        buttonTitle='Delete Site'
        onClick={removeSite}
        setShow={setDeleteSiteWarning}
        show={deleteSiteWarning}
        title='Are you sure you want to delete this site?'
      />
    </div>
  );
};
export default Site;
