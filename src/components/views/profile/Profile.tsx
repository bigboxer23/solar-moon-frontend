import React, { useEffect, useState } from 'react';

import {
  getCustomer,
  getSubscriptionInformation,
} from '../../../services/services';
import type { Customer } from '../../../types/models';
import Loader from '../../common/Loader';
import APIInformation from './APIInformation';
import Appearance from './Appearance';
import ChangePassword from './ChangePassword';
import CustomerInformation from './CustomerInformation';
import DeleteAccount from './DeleteAccount';
import ManagePlanTile from './ManagePlanTile';

interface ProfileProps {
  setTrialDate: (date: number | undefined) => void;
}

export default function Profile({
  setTrialDate,
}: ProfileProps): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(true);
  const [customerData, setCustomerData] = useState<Customer>({} as Customer);

  useEffect(() => {
    getCustomer()
      .then(({ data }) => {
        setLoading(false);
        setCustomerData(data);
      })
      .catch(() => {
        setLoading(false);
        setCustomerData({} as Customer);
      });
    getSubscriptionInformation().then(({ data }) => {
      setTrialDate(data?.joinDate);
    });
  }, [setTrialDate]);

  return (
    <main className='flex max-w-full flex-col items-center'>
      {loading && <Loader />}
      {!loading && (
        <div className='max-w-full'>
          <CustomerInformation customer={customerData} />
          <Appearance />
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
