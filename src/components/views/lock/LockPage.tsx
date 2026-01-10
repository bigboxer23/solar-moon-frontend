import { yupResolver } from '@hookform/resolvers/yup';
import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { MdKey } from 'react-icons/md';
import * as yup from 'yup';

import { useStickyState } from '../../../utils/Utils';
import Button from '../../common/Button';
import { ControlledInput } from '../../common/Input';
import HeaderBar from '../../nav/HeaderBar';

interface LockFormData {
  AccessCode: string;
}

const yupSchema = yup
  .object()
  .shape({
    AccessCode: yup
      .string()
      .required('This field is required')
      .matches(
        new RegExp(process.env.REACT_APP_ACCESS_CODE || ''),
        'Invalid access code',
      ),
  })
  .required();

export const LockPage = (): ReactElement => {
  const [_unlocked, setUnlocked] = useStickyState<string | null>(
    null,
    'unlock.code',
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LockFormData>({
    mode: 'onBlur',
    resolver: yupResolver(yupSchema),
    defaultValues: {
      AccessCode: '',
    },
  });

  const onSubmit = (data: LockFormData) => {
    setUnlocked(data.AccessCode);
    window.location.href = '/';
  };

  return (
    <div className='LockPage flex max-w-full flex-col items-center'>
      <HeaderBar headerText='' />
      <main className='fade-in my-8 flex w-[30rem] max-w-full flex-col content-center bg-white p-6 shadow-panel dark:bg-gray-800 sm:rounded-lg sm:p-8'>
        <div className='text-base font-bold'>
          Enter the access code to proceed to the site
        </div>
        <form
          className='mt-6 flex w-full flex-col'
          onSubmit={handleSubmit(onSubmit)}
        >
          <ControlledInput
            control={control}
            errorMessage={errors.AccessCode?.message}
            inputProps={{
              type: 'password',
              placeholder: 'Enter Access Code',
            }}
            name='AccessCode'
            variant='underline'
          />
          <Button
            buttonProps={{
              type: 'submit',
            }}
            className='mt-8 justify-center'
            variant='primary'
          >
            <MdKey className='button-icon' />
            Submit Access Code
          </Button>
        </form>
      </main>
    </div>
  );
};
