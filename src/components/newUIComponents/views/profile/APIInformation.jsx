import { useState } from 'react';
import { MdOutlineDelete } from 'react-icons/md';

import { updateCustomer as updateRemoteCustomer } from '../../../../services/services';
import Button from '../../common/Button';
import CopyButton from '../../common/CopyButton';
import { Input } from '../../common/Input';
import Spinner from '../../common/Spinner';

export default function APIInformation({ customerData, setCustomerData }) {
  const [accessKeyWarning, setAccessKeyWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const updateCustomer = (dataToUpdate) => {
    setLoading(true);
    updateRemoteCustomer(dataToUpdate != null ? dataToUpdate : customerData)
      .then(({ data }) => {
        setCustomerData(data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <div className='fade-in my-8 w-[55rem] max-w-full rounded-lg bg-white p-6 shadow-panel sm:p-8'>
      <div className='mb-10 flex w-full justify-between'>
        <span className='text-lg font-bold'>API Information</span>
      </div>
      <div>
        <Input
          inputProps={{
            readOnly: true,
            value: customerData?.accessKey || '',
          }}
          label='Access Key'
          suffix={
            <CopyButton
              dataSrc={() => customerData?.accessKey}
              title='Copy Access Key'
            />
          }
          type='text'
          variant='underline'
          wrapperClassName='mb-4'
        />
        <Button
          id='revokeAccessKey'
          onClick={() => setAccessKeyWarning(true)}
          type='button'
          variant='danger'
        >
          {!loading && <MdOutlineDelete className='button-icon' />}
          {loading && <Spinner className='button-icon' />}
          Revoke/Regenerate Access Key
        </Button>
        {accessKeyWarning && (
          <div className='mt-8 rounded-lg border-2 border-danger p-4'>
            <div className='mb-2 flex w-full justify-between text-danger'>
              <span className='text-lg font-bold'>
                Are you sure you want to revoke this key? Doing so is
                non-reversible.
              </span>
            </div>
            <hr />
            <div className='mt-8 flex content-end'>
              <Button
                onClick={() => setAccessKeyWarning(false)}
                variant='secondary'
              >
                Cancel
              </Button>
              <Button
                className='ms-2'
                onClick={() => {
                  setAccessKeyWarning(false);
                  updateCustomer({
                    ...customerData,
                    accessKey: '',
                  });
                }}
                variant='outline-danger'
              >
                Delete Account
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
