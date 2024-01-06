import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { MdKey } from 'react-icons/md';
import * as yup from 'yup';

import { useStickyState } from '../../../../utils/Utils';
import Button from '../../common/Button';
import { ControlledInput } from '../../common/Input';
import HeaderBar from '../../nav/HeaderBar';

const yupSchema = yup
  .object()
  .shape({
    AccessCode: yup
      .string()
      .required('This field is required')
      .matches(process.env.REACT_APP_ACCESS_CODE, 'Invalid access code'),
  })
  .required();

export const LockPage = () => {
  const [_, setUnlocked] = useStickyState(null, 'unlock.code');
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(yupSchema),
    defaultValues: {
      AccessCode: '',
    },
  });

  console.log('errors', errors);

  const onSubmit = (data) => {
    setUnlocked(data.AccessCode);
    window.location.href = '/';
  };

  return (
    <div className='LockPage flex max-w-full flex-col items-center'>
      <HeaderBar headerText='' />
      <main className='fade-in my-8 flex w-[30rem] max-w-full flex-col content-center bg-white p-6 shadow-panel sm:rounded-lg sm:p-8'>
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
              placeholder: 'Enter Access Code',
            }}
            name='AccessCode'
            type='password'
            variant='underline'
          />
          <Button
            className='mt-8 justify-center'
            type='submit'
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
