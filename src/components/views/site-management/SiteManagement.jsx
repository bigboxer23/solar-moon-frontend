import { useEffect, useState } from 'react';
import {
  MdAddCircle,
  MdOutlineAdd,
  MdSettingsInputComposite,
} from 'react-icons/md';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  getDevice,
  getDevices,
  getSeatCount,
  updateDevice,
} from '../../../services/services';
import {
  findSiteNameFromSiteId,
  getDisplayName,
  sortDevices,
  useStickyState,
} from '../../../utils/Utils';
import Button from '../../common/Button';
import Dropdown from '../../common/Dropdown';
import Loader from '../../common/Loader';
import NewDeviceDialog from './NewDeviceDialog';
import NewDeviceExampleDialog from './NewDeviceExampleDialog';
import NewSiteDialog from './NewSiteDialog';
import NewSiteExampleDialog from './NewSiteExampleDialog';
import Site from './Site';

export const noSite = 'No Site';
const SiteManagement = () => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [activeSiteId, setActiveSiteId] = useStickyState('', 'site.management');
  const [showNewSite, setShowNewSite] = useState(false);
  const [showNewSiteExample, setShowNewSiteExample] = useState(false);
  const [showNewDeviceExample, setShowNewDeviceExample] = useState(false);
  const [showNewDevice, setShowNewDevice] = useState(false);
  const [newSiteFormVersion, setNewSiteFormVersion] = useState(0);
  const [subscriptionAvailable, setSubscriptionAvailable] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (loading) {
      return;
    }
    if (devices.length === 0) {
      setShowNewSiteExample(true);
      return;
    }
    if (devices.filter((device) => !device.isSite).length === 0) {
      setShowNewDeviceExample(true);
    }
  }, [devices]);

  const loadDevices = () => {
    getDevices()
      .then(({ data }) => {
        setDevices(data);
        setLoading(false);
        if (activeSiteId === '') {
          setActiveSiteId(data.find((device) => device.isSite)?.id || noSite);
        }
      })
      .catch((e) => {
        setLoading(false);
      });
    getSeatCount().then(({ data }) => {
      setSubscriptionAvailable(data * 20 > devices.length);
    });
  };

  const getSiteSelectItems = () => {
    return [
      ...devices
        .filter((device) => device.isSite)
        .sort(sortDevices)
        .map((site) => {
          return {
            label: findSiteNameFromSiteId(site.id, devices),
            value: site.id,
          };
        }),
      { label: noSite, value: noSite },
      ...(subscriptionAvailable
        ? [
            { divider: true, value: 'divider' },
            {
              label: 'New Site',
              value: '-1',
              icon: <MdOutlineAdd className='button-icon' />,
            },
          ]
        : []),
    ];
  };

  return (
    <main className='SiteManagement flex max-w-full flex-col items-center justify-center '>
      <div className='fade-in my-8 flex w-[45rem] max-w-full flex-col bg-white p-6 shadow-panel dark:bg-gray-800 sm:rounded-lg sm:p-8'>
        <div className='dark:text-gray-100'>
          <div className='mb-10 flex w-full items-center justify-between'>
            <Dropdown
              className='align-self-end'
              onChange={(option) => {
                option.value === '-1'
                  ? setShowNewSite(true)
                  : setActiveSiteId(option.value);
              }}
              options={getSiteSelectItems()}
              prefixLabel='Manage'
              value={{
                label: findSiteNameFromSiteId(activeSiteId, devices),
                value: activeSiteId,
              }}
            />
            <div className='grow' />
            <Button
              className='ms-6'
              disabled={!subscriptionAvailable}
              onClick={() => setShowNewDevice(true)}
              title={
                subscriptionAvailable
                  ? 'Increase the number of seats to add more devices'
                  : 'New Device'
              }
              variant='primary'
            >
              <div className='flex items-center'>
                <MdAddCircle className='button-icon' />
                Add Device
              </div>
            </Button>
            <Button
              buttonProps={{
                title: 'Configure mappings for data retrieved from devices',
              }}
              className='ms-3'
              onClick={() => navigate('/mapping')}
              variant='secondary'
            >
              <div className='flex items-center'>
                <MdSettingsInputComposite />
                <span className='ml-2 hidden sm:flex'>Mappings</span>
              </div>
            </Button>
          </div>
          {!loading && devices.length === 0 && (
            <div>
              You don&apos;t have any devices yet. Add some by clicking
              &quot;Add Device&quot; above!
            </div>
          )}
        </div>
        {loading && <Loader className='self-center' />}
        {[...devices, { id: noSite, name: noSite, isSite: '1', virtual: true }]
          .filter((device) => device.isSite)
          .filter((site) => site.id === activeSiteId)
          .map((site) => {
            return (
              <Site
                data={site}
                devices={devices}
                key={site.id}
                setActiveSiteId={setActiveSiteId}
                setDevices={setDevices}
              />
            );
          })}
        <NewSiteDialog
          key={newSiteFormVersion}
          setActiveSiteId={setActiveSiteId}
          setDevices={setDevices}
          setShow={setShowNewSite}
          setVersion={setNewSiteFormVersion}
          show={showNewSite}
        />
        <NewSiteExampleDialog
          setShow={setShowNewSiteExample}
          show={showNewSiteExample}
          showSiteCreation={setShowNewSite}
        />
        <NewDeviceDialog
          devices={devices}
          key={'device' + newSiteFormVersion + activeSiteId}
          setDevices={setDevices}
          setShow={setShowNewDevice}
          setVersion={setNewSiteFormVersion}
          show={showNewDevice}
          siteId={activeSiteId}
        />
        <NewDeviceExampleDialog
          setShow={setShowNewDeviceExample}
          show={showNewDeviceExample}
          showDeviceCreation={setShowNewDevice}
        />
      </div>
    </main>
  );
};

export default SiteManagement;
