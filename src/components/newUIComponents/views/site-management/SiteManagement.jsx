import { useEffect, useState } from 'react';
import { MdAddCircle, MdOutlineAdd } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import {
  getDevice,
  getDevices,
  getSeatCount,
  updateDevice,
} from '../../../../services/services';
import { sortDevices, useStickyState } from '../../../../utils/Utils';
import Button from '../../common/Button';
import Dropdown from '../../common/Dropdown';
import Loader from '../../common/Loader';
import NewDeviceDialog from './NewDeviceDialog';
import NewSiteDialog from './NewSiteDialog';
import Site from './Site';

export const noSite = 'No Site';
const SiteManagement = () => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [activeSite, setActiveSite] = useStickyState('', 'site.management');
  const [showNewSite, setShowNewSite] = useState(false);
  const [showNewDevice, setShowNewDevice] = useState(false);
  const [newSiteFormVersion, setNewSiteFormVersion] = useState(0);
  const [subscriptionAvailable, setSubscriptionAvailable] = useState(false);
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
      setSubscriptionAvailable(data * 20 > devices.length);
    });
  };

  const getSiteSelectItems = () => {
    return [
      ...devices
        .filter((device) => device.virtual)
        .sort(sortDevices)
        .map((site) => {
          return { label: site.name, value: site.name };
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
    <main className='SiteManagement me-2 ms-2 flex max-w-full flex-col items-center justify-center '>
      <div className='fade-in my-8 flex w-[45rem] max-w-full flex-col rounded-lg bg-white p-6 shadow-panel sm:p-8'>
        <div className=''>
          <div className='mb-10 flex w-full items-center justify-between'>
            <Dropdown
              className='align-self-end'
              onChange={(option) => {
                option.value === '-1'
                  ? setShowNewSite(true)
                  : setActiveSite(option.value);
              }}
              options={getSiteSelectItems()}
              prefixLabel='Manage'
              value={{ label: activeSite, value: activeSite }}
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
              variant='outline-primary'
            >
              <MdAddCircle className='button-icon' />
              Add Device
            </Button>
          </div>
          <div
            className={
              (devices.length === 0 ? '' : 'no-bottom-border ') +
              'flex items-center flex-wrap'
            }
          >
            {/*<Mapping />*/}
          </div>
          {!loading && devices.length === 0 && (
            <div>
              You don&apos;t have any devices yet. Add some by clicking
              &quot;Add Device&quot; above!
            </div>
          )}
        </div>
        {loading && <Loader className='self-center' />}
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
    </main>
  );
};

export default SiteManagement;
