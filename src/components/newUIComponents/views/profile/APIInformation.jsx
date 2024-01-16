import { useState } from 'react';
import { MdOutlineDelete } from 'react-icons/md';

import { updateCustomer as updateRemoteCustomer } from '../../../../services/services';
import AlertSection from '../../common/AlertSection';
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
    <div className='fade-in my-8 w-[40rem] max-w-full rounded-lg bg-white p-6 shadow-panel sm:p-8'>
      <div className='mb-8 flex w-full justify-between'>
        <span className='text-lg font-bold'>API Information</span>
      </div>
      <div>
        <Input
          className='mb-6'
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
        />
        <Button
          className='ml-auto mt-4'
          id='revokeAccessKey'
          onClick={() => setAccessKeyWarning(true)}
          type='button'
          variant='danger'
        >
          {!loading && <MdOutlineDelete className='button-icon' />}
          {loading && <Spinner className='button-icon' />}
          Revoke/Regenerate Access Key
        </Button>
        <AlertSection
          buttonTitle='Revoke Key'
          onClick={() =>
            updateCustomer({
              ...customerData,
              accessKey: '',
            })
          }
          setShow={setAccessKeyWarning}
          show={accessKeyWarning}
          title='Are you sure you want to revoke this key? Doing so is
                non-reversible.'
        />
      </div>
    </div>
  );
}
