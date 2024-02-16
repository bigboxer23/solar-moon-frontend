import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { TbUserCancel } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { deleteCustomer } from '../../../services/services';
import AlertSection from '../../common/AlertSection';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';

export default function DeleteAccount({ customerData }) {
  const [deleteAcctWarning, setDeleteAcctWarning] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuthenticator((context) => [context.user]);

  return (
    <div className='fade-in my-8 w-[40rem] max-w-full bg-white p-6 shadow-panel dark:bg-gray-800 sm:rounded-lg sm:p-8'>
      <div className='mb-8 flex w-full justify-between'>
        <span className='text-lg font-bold text-black dark:text-gray-100'>
          Delete Account
        </span>
      </div>
      <Button
        className='ml-auto '
        disabled={deleting}
        id='deleteAccountButton'
        onClick={() => setDeleteAcctWarning(true)}
        type='button'
        variant='danger'
      >
        {!deleting && <TbUserCancel className='button-icon' />}
        {deleting && <Spinner className='button-icon' />}
        Delete Account
      </Button>
      <AlertSection
        buttonTitle='Delete Account'
        onClick={() => {
          setDeleting(true);
          deleteCustomer(customerData.customerId)
            .then(() => {
              signOut();
              navigate('/');
            })
            .catch((e) => setDeleting(false));
        }}
        setShow={setDeleteAcctWarning}
        show={deleteAcctWarning}
        title='Are you sure you want to delete your account? Doing so is
              non-reversible.'
      />
    </div>
  );
}
