import { useForm } from 'react-hook-form';
import { MdKey } from 'react-icons/md';

import logo from '../../../../assets/logo.svg';
import { useStickyState } from '../../../../utils/Utils';
import Button from '../../common/Button';
import HeaderBar from '../../nav/HeaderBar';

export const LockPage = () => {
  const [_, setUnlocked] = useStickyState(null, 'unlock.code');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
          className='mt-8 flex w-full flex-col'
          onSubmit={handleSubmit(onSubmit)}
        >
          {/*<label>Access Code</label>*/}
          <input
            autoComplete='off'
            placeholder='Enter Access Code'
            type='password'
            {...register('AccessCode', {
              required: true,
              validate: (value, formValues) =>
                process.env.REACT_APP_ACCESS_CODE === value,
            })}
          />
          {errors.AccessCode && (
            <span className='mt-1 text-sm text-danger'>
              {errors.AccessCode?.type === 'required'
                ? 'This field is required'
                : 'Invalid access code'}
            </span>
          )}
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
