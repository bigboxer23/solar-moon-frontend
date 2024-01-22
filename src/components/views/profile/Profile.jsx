import { useEffect, useState } from 'react';

import { getCustomer } from '../../../services/services';
import Loader from '../../common/Loader';
import APIInformation from './APIInformation';
import ChangePassword from './ChangePassword';
import CustomerInformation from './CustomerInformation';
import DeleteAccount from './DeleteAccount';
import ManagePlanTile from './ManagePlanTile';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState({});
  useEffect(() => {
    getCustomer()
      .then(({ data }) => {
        setLoading(false);
        setCustomerData(data);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  return (
    <main className='me-2 ms-2 flex max-w-full flex-col items-center'>
      {loading && <Loader />}
      {!loading && (
        <div className='max-w-full'>
          <CustomerInformation
            email={customerData?.email || ''}
            name={customerData?.name || ''}
          />
          <ManagePlanTile />
          <APIInformation
            customerData={customerData}
            setCustomerData={setCustomerData}
          />
          <ChangePassword />
          <DeleteAccount />
        </div>
      )}
    </main>
  );
}
