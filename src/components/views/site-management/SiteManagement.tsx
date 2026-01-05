import classNames from 'classnames';
import type { ReactElement } from 'react';
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
  getSubscriptionInformation,
  updateDevice,
} from '../../../services/services';
import type { Device } from '../../../types';
import {
  findSiteNameFromSiteId,
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

interface SiteManagementProps {
  setTrialDate: (date: number | undefined) => void;
}

const SiteManagement = ({
  setTrialDate,
}: SiteManagementProps): ReactElement => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [devicesAllowed, setDevicesAllowed] = useState(0);
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
      updateDevice({ ...data.device, notificationsDisabled: true }).then(() => {
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
        setDevices(data.devices);
        setLoading(false);
        if (activeSiteId === '') {
          setActiveSiteId(
            data.devices.find((device) => device.isSite)?.id || noSite,
          );
        }
      })
      .catch((_e) => {
        setLoading(false);
      });
    getSubscriptionInformation().then(({ data }) => {
      setTrialDate(data?.joinDate);
      setDevicesAllowed(data?.packs === -1 ? 10 : data?.packs * 20); // -1 === trial
      setSubscriptionAvailable(data?.packs * 20 > devices.length);
    });
  };

  const getDeviceCountFromSite = (siteId: string): string => {
    return `${devices.filter((device) => device.siteId === siteId).length || ''}`;
  };

  const getSiteSelectionLabel = (siteId: string): string => {
    const siteName = findSiteNameFromSiteId(siteId, devices) || '';
    const deviceCount = getDeviceCountFromSite(siteId);
    return `${siteName}  ${deviceCount}`;
  };
  const getSiteSelectItems = () => {
    return [
      ...devices
        .filter((device) => device.isSite)
        .sort(sortDevices)
        .map((site) => {
          return {
            label: getSiteSelectionLabel(site.id),
            value: site.id,
          };
        }),
      {
        label: getSiteSelectionLabel(noSite),
        value: noSite,
      },
      ...(subscriptionAvailable
        ? [
            { divider: true, value: 'divider', label: '' },
            {
              label: 'New Site',
              value: '-1',
              icon: <MdOutlineAdd className='button-icon' />,
            },
          ]
        : []),
    ];
  };

  const allowed = devices.length <= devicesAllowed;
  const deviceCountClassNames = classNames('text-sm', {
    'text-danger font-bold': !allowed,
    'text-gray-400': allowed,
    'opacity-0': !subscriptionAvailable,
  });

  return (
    <main className='SiteManagement flex max-w-full flex-col items-center justify-center '>
      <div className='fade-in my-8 flex w-[45rem] max-w-full flex-col bg-white p-6 shadow-panel dark:bg-gray-800 sm:rounded-lg sm:p-8'>
        <div className='dark:text-gray-100'>
          <div
            className={deviceCountClassNames}
          >{`${devices.length} of ${devicesAllowed} devices used`}</div>
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
                label: getSiteSelectionLabel(activeSiteId),
                value: activeSiteId,
              }}
            />
            <div className='grow' />
            <Button
              buttonProps={{
                title: subscriptionAvailable
                  ? 'Increase the number of seats to add more devices'
                  : 'New Device',
              }}
              className='ms-6'
              disabled={!subscriptionAvailable}
              onClick={() => setShowNewDevice(true)}
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
        {[
          ...devices,
          {
            id: noSite,
            name: noSite,
            isSite: '1',
            virtual: true,
            deviceName: noSite,
          },
        ]
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
          key={`device${newSiteFormVersion}${activeSiteId}`}
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
