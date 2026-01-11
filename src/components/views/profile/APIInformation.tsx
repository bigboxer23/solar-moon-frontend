import React, { useState } from 'react';
import { MdOutlineDelete } from 'react-icons/md';

import { updateCustomer as updateRemoteCustomer } from '../../../services/services';
import type { Customer } from '../../../types/models';
import AlertSection from '../../common/AlertSection';
import Button from '../../common/Button';
import CopyButton from '../../common/CopyButton';
import { Input } from '../../common/Input';
import Spinner from '../../common/Spinner';

interface APIInformationProps {
  customerData: Customer;
  setCustomerData: (data: Customer) => void;
}

export default function APIInformation({
  customerData,
  setCustomerData,
}: APIInformationProps): React.ReactElement {
  const [accessKeyWarning, setAccessKeyWarning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const updateCustomer = (dataToUpdate?: Customer): void => {
    setLoading(true);
    updateRemoteCustomer(dataToUpdate != null ? dataToUpdate : customerData)
      .then(({ data }) => {
        setCustomerData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className='fade-in my-8 w-[40rem] max-w-full bg-white p-6 shadow-panel dark:bg-gray-800 sm:rounded-lg sm:p-8'>
      <div className='mb-8 flex w-full justify-between'>
        <span className='text-lg font-bold text-black dark:text-gray-100'>
          API Information
        </span>
      </div>
      <div>
        <Input
          className='mb-6'
          inputProps={{
            readOnly: true,
            value: customerData?.accessKey || '',
            type: 'text',
          }}
          label='Access Key'
          suffix={
            <CopyButton
              dataSrc={() => customerData?.accessKey ?? ''}
              title='Copy Access Key'
            />
          }
          variant='underline'
        />
        <Button
          buttonProps={{ id: 'revokeAccessKey', type: 'button' }}
          className='ml-auto mt-4'
          onClick={() => setAccessKeyWarning(true)}
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
