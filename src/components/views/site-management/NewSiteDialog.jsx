import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { addDevice } from '../../../services/services';
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

export default function NewSiteDialog({
  show,
  setShow,
  setDevices,
  setActiveSiteId,
  setVersion,
}) {
  const yupSchema = yup
    .object()
    .shape({
      name: yup.string().required('Site name is required'),
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
  const createNewSite = (site) => {
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
      .catch((e) => {
        setLoading(false);
      });
  };
  return (
    <Modal className='NewSiteDialog' isOpen={show}>
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
            control={control}
            errorMessage={errors.name?.message}
            label='Name'
            name='name'
            type='text'
            variant='underline'
          />
          <div className='flex space-x-6'>
            <div className='grow'>
              <ControlledInput
                className='grow-1 mb-6'
                control={control}
                errorMessage={errors.city?.message}
                label='City'
                name='city'
                type='text'
                variant='underline'
              />
            </div>
            <ControlledInput
              className='mb-6'
              control={control}
              errorMessage={errors.state?.message}
              label='State, Province, or Region'
              name='state'
              type='text'
              variant='underline'
            />
          </div>
          <ControlledInput
            className='mb-6'
            control={control}
            errorMessage={errors.country?.message}
            label='Country'
            name='country'
            type='text'
            variant='underline'
          />
          {/* Needed so pressing enter to submit works*/}
          <Button className='hidden' type='submit' variant='primary'></Button>
        </div>
        <ModalFooter className='space-x-2'>
          <Button
            disabled={loading}
            onClick={handleSubmit(createNewSite)}
            type='submit'
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
