import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineDelete } from 'react-icons/ai';
import { v4 } from 'uuid';
import * as yup from 'yup';

import { deleteDevice, updateDevice } from '../../../services/services';
import AlertSection from '../../common/AlertSection';
import Button from '../../common/Button';
import { ControlledCheck } from '../../common/Check';
import { ControlledInput } from '../../common/Input';
import { ControlledSelect } from '../../common/Select';
import Spinner from '../../common/Spinner';

const Device = ({ data, devices, setDevices }) => {
  const yupSchema = yup
    .object()
    .shape({
      deviceName: yup.string().required('This field is required'),
    })
    .required();

  const [deleteDeviceWarning, setDeleteDeviceWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(yupSchema),
    defaultValues: {
      ...data,
      notificationsEnabled: !data.notificationsDisabled,
      enabled: !data.disabled,
    },
  });
  const update = (data) => {
    setLoading(true);
    updateDevice({
      ...data,
      notificationsDisabled: !data.notificationsEnabled,
      disabled: !data.enabled,
    })
      .then(({ data }) => {
        setDevices([...devices.filter((d) => d.id !== data.id), data]);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const removeDevice = () => {
    setLoading(true);
    deleteDevice(data.id)
      .then(() => {
        setDevices((devices) => devices.filter((d) => d.id !== data.id));
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <div className='Device mb-6 flex w-full flex-col items-center overflow-hidden rounded-md bg-[#f5f5f5] p-6'>
      <div className='mb-10 flex w-full justify-between'>
        <span
          className={(data.disabled ? 'opacity-50 ' : '') + 'text-lg font-bold'}
        >
          {data.name}
        </span>
        <div className='grow' />
        <div title='Disable this device. Alerting will not trigger and device will not be included in site roll up.'>
          <ControlledCheck
            className='hidden-without-hover'
            control={control}
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
            control={control}
            errorMessage={errors.deviceName?.message}
            label='Device Name'
            name='deviceName'
            type='text'
            variant='underline'
          />
          <ControlledInput
            className='mb-6'
            control={control}
            errorMessage={errors.name?.message}
            label='Display Name'
            name='name'
            type='text'
            variant='underline'
          />
          <ControlledSelect
            attributes={devices
              .filter((d) => d.virtual)
              .map((site) => {
                return site.name;
              })}
            control={control}
            errorMessage={errors.site?.message}
            label='Site'
            name='site'
            type='text'
            variant='underline'
            wrapperClassName='mb-6'
          />

          <ControlledCheck
            control={control}
            errorMessage={errors.notificationsEnabled?.message}
            id={v4()}
            label='Notifications'
            name='notificationsEnabled'
            wrapperClassName='mb-6'
          />
        </form>
        <div className='flex justify-end'>
          <Button
            className='hidden-without-hover flex items-center'
            disabled={loading}
            onClick={handleSubmit(update)}
            type='button'
            variant='primary'
          >
            {loading && <Spinner className='button-icon' />}
            Update Device
          </Button>
          <Button
            className='position-relative hidden-without-hover ms-2 w-auto'
            disabled={loading}
            onClick={() => setDeleteDeviceWarning(true)}
            title='Delete Device'
            type='button'
            variant='danger'
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