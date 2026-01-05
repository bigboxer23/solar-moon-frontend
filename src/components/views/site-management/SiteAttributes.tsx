import { yupResolver } from '@hookform/resolvers/yup';
import type { ReactElement } from 'react';
import { useState } from 'react';
import type { Control } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { getDevices, updateDevice } from '../../../services/services';
import type { Device } from '../../../types';
import Button from '../../common/Button';
import { ControlledInput } from '../../common/Input';
import Spinner from '../../common/Spinner';

interface SiteFormData {
  id: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

interface SiteAttributesProps {
  data: Device;
  setDevices: (devices: Device[] | ((prev: Device[]) => Device[])) => void;
  setActiveSiteId: (siteId: string) => void;
}

const SiteAttributes = ({
  data,
  setDevices,
  setActiveSiteId,
}: SiteAttributesProps): ReactElement => {
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
  } = useForm<SiteFormData>({
    mode: 'onBlur',
    resolver: yupResolver(yupSchema) as never,
    defaultValues: data as SiteFormData,
  });

  const update = (site: SiteFormData) => {
    setLoading(true);
    updateDevice(
      maybeUpdateLocation({ ...site, displayName: site.name, site: site.name }),
    )
      .then((_d) => {
        // setDevice(d.data);
        setActiveSiteId(site.id);
        // Fetch all new devices b/c site change cascades down to devices (potentially)
        getDevices().then(({ data }) => {
          setDevices(data.devices);
          setLoading(false);
        });
      })
      .catch((_e) => {
        setLoading(false);
      });
  };

  const maybeUpdateLocation = (
    site: SiteFormData & { displayName: string; site: string },
  ) => {
    if (
      site.city !== undefined &&
      site.state !== undefined &&
      site.country !== undefined &&
      (site.city !== data.city ||
        site.state !== data.state ||
        site.country !== (data as { country?: string }).country)
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
          control={control as unknown as Control}
          errorMessage={errors.name?.message}
          label='Display Name'
          name='name'
          variant='underline'
        />
        <div className='flex'>
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
            className='mb-6 ms-6'
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
