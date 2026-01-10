import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineAddCircle } from 'react-icons/md';
import * as yup from 'yup';

import { addMapping } from '../../../services/services';
import type { Mapping } from '../../../types/models';
import Button from '../../common/Button';
import { ControlledInput } from '../../common/Input';
import { ControlledSelect } from '../../common/Select';
import Spinner from '../../common/Spinner';
import { attributeMappings, attributes } from './MappingConstants';

interface AddMappingProps {
  mappings: Mapping[];
  setMappings: (mappings: Mapping[]) => void;
}

interface MappingFormData {
  mappingName: string;
  attribute: string;
}

export default function AddMapping({ mappings, setMappings }: AddMappingProps) {
  const yupSchema = yup
    .object()
    .shape({
      mappingName: yup
        .string()
        .required('This field is required')
        .test('mappingNameValidator', 'Already added', (value) => {
          if (!value) return true;

          const compare = (d: { mappingName: string }) => {
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
      attribute: yup.string().required('This field is required'),
    })
    .required();

  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MappingFormData>({
    mode: 'onBlur',
    resolver: yupResolver(yupSchema),
    defaultValues: {
      mappingName: '',
      attribute: 'Average Current',
    },
  });

  const onSubmit = (data: MappingFormData) => {
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
          type: 'text',
          placeholder: 'Voltage | Current | PF',
        }}
        label='Mapping Name'
        name='mappingName'
        variant='underline'
      />
      <div className='mx-8 font-bold'>{'->'}</div>
      <ControlledSelect
        attributes={attributes.map((m) => ({ label: m, id: m }))}
        control={control}
        errorMessage={errors.attribute?.message}
        label='Attribute'
        name='attribute'
        variant='underline'
      />
      <Button
        buttonProps={{
          id: 'add-mapping-button',
          type: 'submit',
          title: 'Add Attribute',
        }}
        className='ms-3'
        disabled={loading}
        variant='outline-secondary'
      >
        {!loading && <MdOutlineAddCircle />}
        {loading && <Spinner />}
      </Button>
    </form>
  );
}
