import { yupResolver } from '@hookform/resolvers/yup';
import type { ReactElement } from 'react';
import { useState } from 'react';
import type { Control } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { addDevice } from '../../../services/services';
import type { Device } from '../../../types';
import { findSiteNameFromSiteId } from '../../../utils/Utils';
import Button from '../../common/Button';
import { ControlledInput } from '../../common/Input';
import Modal, { ModalFooter, ModalHeader } from '../../common/Modal';
import { ControlledSelect } from '../../common/Select';
import Spinner from '../../common/Spinner';

interface NewDeviceFormData {
  siteId: string;
  deviceName: string;
  name: string;
}

interface NewDeviceDialogProps {
  show: boolean;
  setShow: (show: boolean) => void;
  devices: Device[];
  setDevices: (devices: Device[] | ((prev: Device[]) => Device[])) => void;
  setVersion: (version: number | ((prev: number) => number)) => void;
  siteId: string;
}

export default function NewDeviceDialog({
  show,
  setShow,
  devices,
  setDevices,
  setVersion,
  siteId,
}: NewDeviceDialogProps): ReactElement {
  const yupSchema = yup
    .object()
    .shape({
      siteId: yup.string().required(),
      deviceName: yup.string().required('Device name is required'),
      name: yup.string().required('Display name is required'),
    })
    .required();

  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewDeviceFormData>({
    mode: 'onBlur',
    resolver: yupResolver(yupSchema) as never,
    defaultValues: {
      siteId: siteId,
      deviceName: '',
      name: '',
    },
  });
  const createNewDevice = (device: NewDeviceFormData) => {
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
      .catch((_e) => {
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
            control={control as unknown as Control}
            errorMessage={errors.deviceName?.message}
            label='Device Name'
            name='deviceName'
            variant='underline'
          />
          <ControlledInput
            className='grow-1 mb-6'
            control={control as unknown as Control}
            errorMessage={errors.name?.message}
            label='Display Name'
            name='name'
            variant='underline'
          />
          <ControlledSelect
            attributes={devices
              .filter((d) => d.isSite)
              .map((site) => {
                return {
                  id: site.id,
                  label: findSiteNameFromSiteId(site.id, devices) || '',
                };
              })}
            control={control as unknown as Control}
            errorMessage={errors.siteId?.message}
            label='Site'
            name='siteId'
            variant='underline'
          />
        </div>
        {/* Needed so pressing enter to submit works*/}
        <ModalFooter className='space-x-2'>
          <Button
            disabled={loading}
            onClick={handleSubmit(createNewDevice)}
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
