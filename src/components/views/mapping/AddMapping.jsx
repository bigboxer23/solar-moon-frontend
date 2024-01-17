import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineAddCircle } from 'react-icons/md';
import * as yup from 'yup';

import { addMapping } from '../../../services/services';
import Button from '../../common/Button';
import { ControlledInput } from '../../common/Input';
import { ControlledSelect } from '../../common/Select';
import Spinner from '../../common/Spinner';
import { attributeMappings, attributes, AVG_CURRENT } from './MappingConstants';

export default function AddMapping({ mappings, setMappings }) {
  const yupSchema = yup
    .object()
    .shape({
      mappingName: yup
        .string()
        .required('This field is required')
        .test('mappingNameValidator', 'Already added', (value) => {
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
            return false;
          }
          return mappings.find(compare) === undefined;
        }),
    })
    .required();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(yupSchema),
    defaultValues: {
      mappingName: '',
      attribute: 'Average Current',
    },
  });

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
      className='mb-4 flex items-center rounded-md border-2 p-4'
      onSubmit={handleSubmit(onSubmit)}
    >
      <ControlledInput
        control={control}
        errorMessage={errors.mappingName?.message}
        inputProps={{
          placeholder: 'Voltage | Current | PF',
        }}
        label='Mapping Name'
        name='mappingName'
        type='text'
        variant='underline'
      />
      <div className='mx-8 font-bold'>{'->'}</div>
      <ControlledSelect
        attributes={attributes}
        control={control}
        errorMessage={errors.attributes?.message}
        label='Attribute'
        name='attribute'
        type='text'
        variant='underline'
      />
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
