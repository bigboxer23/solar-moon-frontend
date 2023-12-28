import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { TbUserCancel } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { deleteCustomer } from '../../../../services/services';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';

export default function DeleteAccount({ customerData }) {
  const [deleteAcctWarning, setDeleteAcctWarning] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuthenticator((context) => [context.user]);

  return (
    <div className='fade-in my-8 w-[55rem] max-w-full rounded-lg bg-white p-6 shadow-panel sm:p-8'>
      <div className='mb-10 flex w-full justify-between'>
        <span className='text-lg font-bold'>Delete Account</span>
      </div>
      <Button
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
      {deleteAcctWarning && (
        <div className='mt-8 rounded-lg border-2 border-danger p-4'>
          <div className='mb-2 flex w-full justify-between text-danger'>
            <span className='text-lg font-bold'>
              Are you sure you want to delete your account? Doing so is
              non-reversible.
            </span>
          </div>
          <hr />
          <div className='mt-8 flex content-end'>
            <Button
              onClick={() => setDeleteAcctWarning(false)}
              variant='secondary'
            >
              Cancel
            </Button>
            <Button
              className='ms-2'
              onClick={() => {
                setDeleteAcctWarning(false);
                setDeleting(true);
                deleteCustomer(customerData.customerId)
                  .then(() => {
                    signOut();
                    navigate('/');
                  })
                  .catch((e) => console.log(e));
              }}
              variant='outline-danger'
            >
              Delete Account
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
