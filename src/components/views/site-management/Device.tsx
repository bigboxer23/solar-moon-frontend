import { yupResolver } from '@hookform/resolvers/yup';
import type { ReactElement } from 'react';
import { useState } from 'react';
import type { Control } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { AiOutlineDelete } from 'react-icons/ai';
import { v4 } from 'uuid';
import * as yup from 'yup';

import { deleteDevice, updateDevice } from '../../../services/services';
import type { Device as DeviceType } from '../../../types';
import { findSiteNameFromSiteId } from '../../../utils/Utils';
import AlertSection from '../../common/AlertSection';
import Button from '../../common/Button';
import { ControlledCheck } from '../../common/Check';
import { ControlledInput } from '../../common/Input';
import { ControlledSelect } from '../../common/Select';
import Spinner from '../../common/Spinner';
import { noSite } from './SiteManagement';

interface DeviceFormData {
  id: string;
  deviceName: string;
  name?: string;
  siteId: string;
  notificationsEnabled: boolean;
  enabled: boolean;
}

interface DeviceProps {
  data: DeviceType;
  devices: DeviceType[];
  setDevices: (
    devices: DeviceType[] | ((prev: DeviceType[]) => DeviceType[]),
  ) => void;
}

const Device = ({ data, devices, setDevices }: DeviceProps): ReactElement => {
  const yupSchema = yup
    .object()
    .shape({
      id: yup.string().required(),
      deviceName: yup.string().required('This field is required'),
      name: yup.string().optional(),
      siteId: yup.string().required(),
      notificationsEnabled: yup.boolean().required(),
      enabled: yup.boolean().required(),
    })
    .required();

  const [deleteDeviceWarning, setDeleteDeviceWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeviceFormData>({
    mode: 'onBlur',
    resolver: yupResolver(yupSchema) as never,
    defaultValues: {
      ...data,
      notificationsEnabled: !data.notificationsDisabled,
      enabled: !data.disabled,
    },
  });

  const update = (formData: DeviceFormData) => {
    setLoading(true);
    updateDevice({
      ...formData,
      notificationsDisabled: !formData.notificationsEnabled,
      disabled: !formData.enabled,
      site: findSiteNameFromSiteId(formData.siteId, devices),
    })
      .then(({ data }) => {
        setDevices([
          ...devices.filter((d) => d.id !== data.device.id),
          data.device,
        ]);
        setLoading(false);
      })
      .catch((_e) => {
        setLoading(false);
      });
  };

  const removeDevice = () => {
    setLoading(true);
    deleteDevice(data.id)
      .then(() => {
        setDevices((devices) => devices.filter((d) => d.id !== data.id));
      })
      .catch((_e) => {
        setLoading(false);
      });
  };

  return (
    <div className='Device mb-6 flex w-full flex-col items-center overflow-hidden rounded-md bg-grid-background-alt p-6 dark:bg-gray-700'>
      <div className='mb-10 flex w-full justify-between'>
        <span
          className={`${
            data.disabled ? 'opacity-50 ' : ''
          }text-lg font-bold text-black dark:text-gray-100`}
        >
          {data.name}
        </span>
        <div className='grow' />
        <div title='Disable this device. Alerting will not trigger and device will not be included in site roll up.'>
          <ControlledCheck
            control={control as unknown as Control}
            errorMessage={errors.enabled?.message}
            id={v4()}
            name='enabled'
          />
        </div>
      </div>
      <div className='w-full'>
        <form
          className={data.disabled ? 'hidden' : ''}
          onSubmit={handleSubmit(update)}
        >
          <ControlledInput
            className='mb-6'
            control={control as unknown as Control}
            errorMessage={errors.deviceName?.message}
            label='Device Name'
            name='deviceName'
            variant='underline'
          />
          <ControlledInput
            className='mb-6'
            control={control as unknown as Control}
            errorMessage={errors.name?.message}
            label='Display Name'
            name='name'
            variant='underline'
          />
          <div className='mb-6'>
            <ControlledSelect
              attributes={[
                ...devices
                  .filter((d) => d.isSite)
                  .map((site) => {
                    return {
                      label: findSiteNameFromSiteId(site.id, devices) || '',
                      id: site.id,
                    };
                  }),
                { label: noSite, id: noSite },
              ]}
              control={control as unknown as Control}
              errorMessage={errors.siteId?.message}
              label='Site'
              name='siteId'
              variant='underline'
            />
          </div>

          <div className='mb-6'>
            <ControlledCheck
              control={control as unknown as Control}
              errorMessage={errors.notificationsEnabled?.message}
              id={v4()}
              label='Notifications'
              name='notificationsEnabled'
            />
          </div>
        </form>
        <div className='mt-2 flex justify-end'>
          <Button
            className=' flex items-center'
            disabled={loading}
            onClick={handleSubmit(update)}
            variant='primary'
          >
            {loading && <Spinner className='button-icon' />}
            Update Device
          </Button>
          <Button
            buttonProps={{
              title: 'Delete Device',
              'aria-label': 'Delete Device',
            }}
            className='position-relative  ms-2 w-auto'
            disabled={loading}
            onClick={() => setDeleteDeviceWarning(true)}
            variant='secondary'
          >
            <AiOutlineDelete className='mb-[2px] size-4 font-bold' />
          </Button>
        </div>
        <AlertSection
          buttonTitle='Delete Device'
          onClick={() => removeDevice()}
          setShow={setDeleteDeviceWarning}
          show={deleteDeviceWarning}
          title='Are you sure you want to delete this device?'
        />
      </div>
    </div>
  );
};

export default Device;
