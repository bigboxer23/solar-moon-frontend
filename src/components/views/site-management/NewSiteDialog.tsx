import { yupResolver } from '@hookform/resolvers/yup';
import type { ReactElement } from 'react';
import { useState } from 'react';
import type { Control } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { addDevice } from '../../../services/services';
import type { Device } from '../../../types';
import {
  SITE_HELP_TEXT1,
  SITE_HELP_TEXT2,
  SITE_HELP_TEXT3,
} from '../../../utils/HelpText';
import Button from '../../common/Button';
import Help from '../../common/Help';
import { ControlledInput } from '../../common/Input';
import Modal, { ModalFooter, ModalHeader } from '../../common/Modal';
import Spinner from '../../common/Spinner';

interface NewSiteFormData {
  virtual: boolean;
  virtualIndex: string;
  isSite: string;
  name: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface NewSiteDialogProps {
  show: boolean;
  setShow: (show: boolean) => void;
  setDevices: (devices: Device[] | ((prev: Device[]) => Device[])) => void;
  setActiveSiteId: (siteId: string) => void;
  setVersion: (version: number | ((prev: number) => number)) => void;
}

export default function NewSiteDialog({
  show,
  setShow,
  setDevices,
  setActiveSiteId,
  setVersion,
}: NewSiteDialogProps): ReactElement {
  const yupSchema = yup
    .object()
    .shape({
      virtual: yup.boolean().required(),
      virtualIndex: yup.string().required(),
      isSite: yup.string().required(),
      name: yup.string().required('Site name is required'),
      city: yup.string(),
      state: yup.string(),
      country: yup.string(),
      latitude: yup.number().required(),
      longitude: yup.number().required(),
    })
    .required();

  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewSiteFormData>({
    mode: 'onBlur',
    resolver: yupResolver(yupSchema) as never,
    defaultValues: {
      virtual: true,
      virtualIndex: 'true',
      isSite: '1',
      name: '',
      city: '',
      state: '',
      country: '',
      latitude: -1,
      longitude: -1,
    },
  });
  const createNewSite = (site: NewSiteFormData) => {
    setLoading(true);
    addDevice({
      ...site,
      deviceName: site.name,
      site: site.name,
    })
      .then(({ data }) => {
        setDevices((devices) => [...devices, data]);
        setActiveSiteId(data.id);
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
        label={
          <div className='flex items-center'>
            Create New Site{' '}
            <Help
              className='ml-2'
              content={`${SITE_HELP_TEXT1} ${SITE_HELP_TEXT2} ${SITE_HELP_TEXT3}`}
            />
          </div>
        }
        onCloseClick={() => setShow(false)}
      />
      <form onSubmit={handleSubmit(createNewSite)}>
        <div className='px-6 pt-5'>
          <ControlledInput
            className='mb-6'
            control={control as unknown as Control}
            errorMessage={errors.name?.message}
            label='Name'
            name='name'
            variant='underline'
          />
          <div className='flex gap-x-6'>
            <div className='grow'>
              <ControlledInput
                className='grow-1 mb-6'
                control={control as unknown as Control}
                errorMessage={errors.city?.message}
                label='City'
                name='city'
                variant='underline'
              />
            </div>
            <ControlledInput
              className='mb-6'
              control={control as unknown as Control}
              errorMessage={errors.state?.message}
              label='State, Province, or Region'
              name='state'
              variant='underline'
            />
          </div>
          <ControlledInput
            className='mb-6'
            control={control as unknown as Control}
            errorMessage={errors.country?.message}
            label='Country'
            name='country'
            variant='underline'
          />
          {/* Needed so pressing enter to submit works*/}
        </div>
        <ModalFooter className='gap-x-2'>
          <Button
            disabled={loading}
            onClick={handleSubmit(createNewSite)}
            variant='primary'
          >
            {loading && <Spinner className='button-icon' />}
            Create Site
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
