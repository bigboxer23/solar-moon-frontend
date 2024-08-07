import 'react-toastify/dist/ReactToastify.css';

import { yupResolver } from '@hookform/resolvers/yup';
import { updatePassword } from 'aws-amplify/auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlinePassword } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import * as yup from 'yup';

import Button from '../../common/Button';
import { ControlledInput } from '../../common/Input';
import Spinner from '../../common/Spinner';

const ChangePassword = () => {
  const yupSchema = yup
    .object()
    .shape({
      oldPassword: yup.string().required('Old password is required'),
      newPassword: yup.string().required('New password is required'),
      confirmNewPassword: yup
        .string()
        .required('Password confirmation is required')
        .test(
          'confirmationRequired',
          'New password does not match',
          (value, options) => {
            return value === options.parent.newPassword;
          },
        ),
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
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = (data) => {
    changePassword(data.oldPassword, data.newPassword);
  };

  async function changePassword(oldPassword, newPassword) {
    setLoading(true);
    try {
      await updatePassword({
        oldPassword,
        newPassword,
      });
      toast.success('Password successfully updated!', {
        position: 'bottom-right',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } catch (err) {
      toast.error('Unable to update password.', {
        position: 'bottom-right',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      console.log(err);
    }
    setLoading(false);
  }

  return (
    <div className='fade-in my-8 w-[40rem] max-w-full bg-white p-6 shadow-panel dark:bg-gray-800 sm:rounded-lg sm:p-8'>
      <div className='mb-8 flex w-full justify-between'>
        <span className='text-lg font-bold text-black dark:text-gray-100'>
          Change Password
        </span>
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ControlledInput
            className='mb-6'
            control={control}
            errorMessage={errors.oldPassword?.message}
            inputProps={{
              placeholder: 'Old Password',
              type: 'password',
            }}
            label='Old Password'
            name='oldPassword'
            variant='underline'
          />
          <ControlledInput
            className='mb-6'
            control={control}
            errorMessage={errors.newPassword?.message}
            inputProps={{
              placeholder: 'New Password',
              type: 'password',
            }}
            label='New Password'
            name='newPassword'
            variant='underline'
          />
          <ControlledInput
            className='mb-6'
            control={control}
            errorMessage={errors.confirmNewPassword?.message}
            inputProps={{
              placeholder: 'Confirm New Password',
              type: 'password',
            }}
            label='Confirm New Password'
            name='confirmNewPassword'
            variant='underline'
          />
          <Button
            className='ml-auto mt-4'
            disabled={loading}
            type='submit'
            variant='primary'
          >
            {!loading && <MdOutlinePassword className='button-icon' />}
            {loading && <Spinner className='button-icon' />}
            Change Password
          </Button>
        </form>
        <ToastContainer
          autoClose={2500}
          closeOnClick
          draggable
          hideProgressBar={false}
          newestOnTop={false}
          pauseOnFocusLoss
          pauseOnHover
          position='bottom-right'
          rtl={false}
          theme='light'
        />
      </div>
    </div>
  );
};
export default ChangePassword;
