import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { addDevice } from '../../../services/services';
import { findSiteNameFromSiteId } from '../../../utils/Utils';
import Button from '../../common/Button';
import { ControlledInput } from '../../common/Input';
import Modal, { ModalFooter, ModalHeader } from '../../common/Modal';
import { ControlledSelect } from '../../common/Select';
import Spinner from '../../common/Spinner';

export default function NewDeviceDialog({
  show,
  setShow,
  devices,
  setDevices,
  setVersion,
  siteId,
}) {
  const yupSchema = yup
    .object()
    .shape({
      deviceName: yup.string().required('Device name is required'),
      name: yup.string().required('Display name is required'),
    })
    .required();

  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(yupSchema),
    defaultValues: {
      siteId: siteId,
      deviceName: '',
      name: '',
    },
  });
  const createNewDevice = (device) => {
    setLoading(true);
    addDevice({
      ...device,
      site: findSiteNameFromSiteId(device.siteId, devices),
    })
      .then(({ data }) => {
        setDevices((devices) => [...devices, data]);
        setVersion((v) => v + 1);
        setShow(false);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };
  return (
    <Modal isOpen={show}>
      <ModalHeader
        label='Create New Device'
        onCloseClick={() => setShow(false)}
      />
      <form onSubmit={handleSubmit(createNewDevice)}>
        <div className='px-6 py-4'>
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
            className='grow-1 mb-6'
            control={control}
            errorMessage={errors.name?.message}
            label='Display Name'
            name='name'
            type='text'
            variant='underline'
          />
          <ControlledSelect
            attributes={devices
              .filter((d) => d.isSite)
              .map((site) => {
                return {
                  id: site.id,
                  label: findSiteNameFromSiteId(site.id, devices),
                };
              })}
            control={control}
            errorMessage={errors.site?.message}
            label='Site'
            name='siteId'
            type='text'
            variant='underline'
          />
        </div>
        {/* Needed so pressing enter to submit works*/}
        <Button className='hidden' type='submit' variant='primary'></Button>
        <ModalFooter className='space-x-2'>
          <Button
            disabled={loading}
            onClick={handleSubmit(createNewDevice)}
            type='submit'
            variant='primary'
          >
            {loading && <Spinner className='button-icon' />}
            Create Device
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
