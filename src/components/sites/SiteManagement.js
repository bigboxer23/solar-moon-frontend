import { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Dropdown } from 'react-bootstrap';
import { MdAddCircle, MdOutlineAdd } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import {
  getDevice,
  getDevices,
  getSeatCount,
  updateDevice,
} from '../../services/services';
import { sortDevices, useStickyState } from '../../utils/Utils';
import Loader from '../common/Loader';
import Mapping from '../mapping/Mapping';
import NewDeviceDialog from './NewDeviceDialog';
import NewSiteDialog from './newSiteDialog';
import Site from './Site';

export const noSite = 'No Site';
const SiteManagement = () => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [activeSite, setActiveSite] = useStickyState('', 'site.management');
  const [showNewSite, setShowNewSite] = useState(false);
  const [showNewDevice, setShowNewDevice] = useState(false);
  const [newSiteFormVersion, setNewSiteFormVersion] = useState(0);
  const [subscriptionDevices, setSubscriptionDevices] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const disableNotifications = searchParams.get('disable');
    if (disableNotifications === null) {
      loadDevices();
      return;
    }
    searchParams.delete('disable');
    setSearchParams(searchParams);
    getDevice(disableNotifications).then(({ data }) => {
      updateDevice({ ...data, notificationsDisabled: true }).then(() => {
        loadDevices();
      });
    });
  }, []);

  const loadDevices = () => {
    getDevices()
      .then(({ data }) => {
        setDevices(data);
        setLoading(false);
        if (activeSite === '') {
          setActiveSite(data.find((device) => device.virtual)?.name || noSite);
        }
      })
      .catch((e) => {
        setLoading(false);
      });
    getSeatCount().then(({ data }) => {
      setSubscriptionDevices(data * 10);
    });
  };

  const isDisabledForSubscription = () => {
    return subscriptionDevices > devices.length ? '' : ' disabled';
  };

  const getNewSiteContent = () => {
    return subscriptionDevices > devices.length ? (
      <div>
        <Dropdown.Divider />
        <Dropdown.Item
          as='button'
          className='Success'
          eventKey='new'
          onClick={() => setShowNewSite(true)}
        >
          <MdOutlineAdd className='button-icon' />
          Create New Site
        </Dropdown.Item>
      </div>
    ) : (
      ''
    );
  };

  return (
    <div className='root-page d-flex flex-column min-vh-95 container'>
      <Card className={devices.length === 0 ? '' : 'no-bottom-border-radius'}>
        <CardHeader
          className={
            (devices.length === 0 ? '' : 'no-bottom-border ') +
            'd-flex align-items-center flex-wrap'
          }
        >
          <div className='fs-3 site-name'>{activeSite}</div>
          <div className='grow-1' />
          <Dropdown className='align-self-end'>
            <Dropdown.Toggle id='dropdown-basic' variant='primary'>
              {activeSite === '' ? 'Loading' : activeSite}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {devices
                .filter((device) => device.virtual)
                .sort(sortDevices)
                .map((site) => {
                  return (
                    <Dropdown.Item
                      as='button'
                      key={site.name}
                      onClick={() => setActiveSite(site.name)}
                    >
                      {site.name}
                    </Dropdown.Item>
                  );
                })}
              <Dropdown.Item
                as='button'
                key='none'
                onClick={() => setActiveSite(noSite)}
              >
                {noSite}
              </Dropdown.Item>
              {getNewSiteContent()}
            </Dropdown.Menu>
          </Dropdown>
          <Button
            className={'ms-3' + isDisabledForSubscription()}
            onClick={() => setShowNewDevice(true)}
            title={
              isDisabledForSubscription()
                ? 'Increase the number of seats to add more devices'
                : 'New Device'
            }
            variant='outline-light'
          >
            <MdAddCircle className='button-icon' />
            Add Device
          </Button>
          <Mapping />
        </CardHeader>
        <CardBody className={devices.length === 0 ? '' : 'd-none'}>
          <Loader
            content={
              'You don\'t have any devices yet.  Add some by clicking the "Add Device" above!'
            }
            deviceCount={devices.length}
            loading={loading}
          />
        </CardBody>
      </Card>
      {[...devices, { id: noSite, name: noSite, virtual: true }]
        .filter((device) => device.virtual)
        .filter((site) => site.name === activeSite)
        .map((site) => {
          return (
            <Site
              data={site}
              devices={devices}
              key={site.id}
              setActiveSite={setActiveSite}
              setDevices={setDevices}
            />
          );
        })}
      <NewSiteDialog
        key={newSiteFormVersion}
        setActiveSite={setActiveSite}
        setDevices={setDevices}
        setShow={setShowNewSite}
        setVersion={setNewSiteFormVersion}
        show={showNewSite}
      />
      <NewDeviceDialog
        devices={devices}
        key={'device' + newSiteFormVersion + activeSite}
        setDevices={setDevices}
        setShow={setShowNewDevice}
        setVersion={setNewSiteFormVersion}
        show={showNewDevice}
        site={activeSite}
      />
    </div>
  );
};

export default SiteManagement;
