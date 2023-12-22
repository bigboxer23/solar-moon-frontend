import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineAddCircle } from 'react-icons/md';

import { addMapping } from '../../../../services/services';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';
import { attributeMappings, attributes, AVG_CURRENT } from './MappingConstants';

export default function AddMapping({ mappings, setMappings }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    addMapping(data.attribute, data.mappingName.trim())
      .then(() => {
        setMappings([
          ...mappings,
          {
            mappingName: data.mappingName.trim(),
            attribute: data.attribute,
          },
        ]);
        reset();
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <form
      className='mb-4 flex items-center rounded-md bg-[#f5f5f5] p-4'
      onSubmit={handleSubmit(onSubmit)}
    >
      <label className='mr-4 font-bold'>Name:</label>
      <div className='flex flex-col'>
        <input
          className={`theme('danger') ${errors.mappingName ? 'invalid' : ''}`}
          {...register('mappingName', {
            required: true,
            validate: (value, formValues) => {
              const compare = (d) => {
                return (
                  d.mappingName.localeCompare(value.trim(), undefined, {
                    sensitivity: 'accent',
                  }) === 0
                );
              };
              if (
                Object.entries(attributeMappings)
                  .map((d) => {
                    return { mappingName: d[0] };
                  })
                  .find(compare) !== undefined ||
                attributes
                  .map((d) => {
                    return {
                      mappingName: d,
                    };
                  })
                  .find(compare) !== undefined
              ) {
                return 'Already added';
              }
              if (mappings.find(compare) !== undefined) {
                return 'Already added';
              }
              return true;
            },
          })}
        />{' '}
        {errors.mappingName && (
          <span className='mt-1 text-sm text-danger'>
            {errors.mappingName?.message}
          </span>
        )}
      </div>
      <div className='mx-8 font-bold'>{'->'}</div>
      <label className='mr-4 font-bold'>Attribute:</label>
      <select className='mr-8' {...register('attribute')}>
        {attributes.map((attr) => {
          return (
            <option key={attr} value={attr}>
              {attr}
            </option>
          );
        })}
      </select>
      <Button
        buttonProps={{
          title: 'Add Attribute',
        }}
        className='ms-3'
        disabled={loading}
        id='add-mapping-button'
        type='submit'
        variant='outline-secondary'
      >
        {!loading && <MdOutlineAddCircle />}
        {loading && <Spinner />}
      </Button>
    </form>
  );
}
