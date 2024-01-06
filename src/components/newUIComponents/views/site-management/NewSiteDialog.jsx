import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { addDevice } from '../../../../services/services';
import Button from '../../common/Button';
import { ControlledInput } from '../../common/Input';
import Modal, { ModalFooter, ModalHeader } from '../../common/Modal';
import Spinner from '../../common/Spinner';

const NewSiteDialog = ({
  show,
  setShow,
  setDevices,
  setActiveSite,
  setVersion,
}) => {
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
      deviceName: name,
      site: name,
    })
      .then(({ data }) => {
        setDevices((devices) => [...devices, data]);
        setActiveSite(data.name);
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
        label='Create New Site'
        onCloseClick={() => setShow(false)}
      />
      <form className='p-5' onSubmit={handleSubmit(createNewSite)}>
        <ControlledInput
          control={control}
          errorMessage={errors.name?.message}
          label='Name'
          name='name'
          type='text'
          variant='underline'
          wrapperClassName='mb-6'
        />
        <div className='flex'>
          <div className='grow'>
            <ControlledInput
              control={control}
              errorMessage={errors.city?.message}
              label='City'
              name='city'
              type='text'
              variant='underline'
              wrapperClassName='mb-6 grow-1'
            />
          </div>
          <ControlledInput
            control={control}
            errorMessage={errors.state?.message}
            label='State, Province, or Region'
            name='state'
            type='text'
            variant='underline'
            wrapperClassName='mb-6'
          />
        </div>
        <ControlledInput
          control={control}
          errorMessage={errors.country?.message}
          label='Country'
          name='country'
          type='text'
          variant='underline'
          wrapperClassName='mb-6'
        />
        {/*Needed so pressing enter to submit works*/}
        <Button className='hidden' type='submit' variant='primary'></Button>
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
};
export default NewSiteDialog;
