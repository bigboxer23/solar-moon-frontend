import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { getDevices, updateDevice } from '../../../services/services';
import Button from '../../common/Button';
import { ControlledInput } from '../../common/Input';
import Spinner from '../../common/Spinner';

const SiteAttributes = ({ data, setDevices, setActiveSiteId }) => {
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
    defaultValues: data,
  });

  const update = (site) => {
    setLoading(true);
    updateDevice(
      maybeUpdateLocation({ ...site, displayName: site.name, site: site.name }),
    )
      .then((d) => {
        //setDevice(d.data);
        setActiveSiteId(site.id);
        //Fetch all new devices b/c site change cascades down to devices (potentially)
        getDevices().then(({ data }) => {
          setDevices(data);
          setLoading(false);
        });
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const maybeUpdateLocation = (site) => {
    if (
      site.city !== null &&
      site.state !== null &&
      site.country !== null &&
      (site.city !== data.city ||
        site.state !== data.state ||
        site.country !== data.country)
    ) {
      return {
        ...site,
        latitude: -1,
        longitude: -1,
      };
    }
    return site;
  };

  return (
    <div className='SiteAttributes mb-4 flex items-center rounded-md bg-white p-6 dark:bg-gray-700'>
      <form className='w-full' onSubmit={handleSubmit(update)}>
        <ControlledInput
          className='mb-6'
          control={control}
          errorMessage={errors.name?.message}
          label='Display Name'
          name='name'
          type='text'
          variant='underline'
        />
        <div className='flex'>
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
            className='mb-6 ms-6'
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
        <div className='flex items-center'>
          <div
            className={`${
              data.latitude !== -1 && data.longitude !== -1 ? '' : 'opacity-0 '
            }smaller-text flex content-end text-sm text-gray-400`}
          >
            {`${data.latitude},${data.longitude}`}
          </div>
          <div className='grow' />
          <Button
            disabled={loading}
            onClick={() => handleSubmit(update)}
            type='button'
            variant='primary'
          >
            {loading && <Spinner className='button-icon' />}
            Update Site
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SiteAttributes;
