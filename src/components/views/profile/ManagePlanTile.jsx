import { useEffect, useState } from 'react';
import { MdOutlineSubscriptions } from 'react-icons/md';

import { DAY } from '../../../services/search';
import {
  getStripeSubscriptions,
  getSubscriptionInformation,
  getUserPortalSession,
} from '../../../services/services';
import Button from '../../common/Button';
import Loader from '../../common/Loader';
import Spinner from '../../common/Spinner';

export default function ManagePlanTile() {
  const [billingLoading, setBillingLoading] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [period, setPeriod] = useState('');
  const [periodShort, setPeriodShort] = useState('');
  const [price, setPrice] = useState(40);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [trialMode, setTrialMode] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(90);

  useEffect(() => {
    getStripeSubscriptions().then(({ data }) => {
      if (data.length === 0) {
        getSubscriptionInformation().then(({ data }) => {
          setLoading(false);
          if (data?.packs !== -1) {
            setInvalid(true);
            return;
          }
          setTrialMode(true);
          const joinDate = data?.joinDate + DAY * 90;
          setTrialDaysLeft(Math.round((joinDate - new Date().getTime()) / DAY));
        });
        return;
      }
      setQuantity(data[0].quantity);
      setPeriod(data[0].interval === 'month' ? 'Monthly' : 'Yearly');
      setPeriodShort(data[0].interval === 'month' ? 'mo' : 'yr');
      setPrice(data[0].interval === 'month' ? 40 : 432);
      setLoading(false);
    });
  }, []);
  const gotoPortal = () => {
    setBillingLoading(true);
    getUserPortalSession()
      .then(({ data }) => {
        setBillingLoading(false);
        window.location.href = data;
      })
      .catch((e) => {
        setBillingLoading(false);
      });
  };

  return (
    <div className='price fade-in my-8 w-[40rem] max-w-full bg-white p-6 shadow-panel dark:bg-gray-800 sm:rounded-lg sm:p-8'>
      <div className='mb-8 flex w-full justify-between'>
        <span className='text-lg font-bold text-black dark:text-gray-100'>
          Billing Information
        </span>
      </div>
      {loading && <Loader className='flex w-full justify-center' />}
      {!loading && !invalid && !trialMode && (
        <div className='flex flex-col'>
          <div className='mb-2 flex items-center'>
            <div className='text-xl font-bold'>{period}</div>
          </div>
          <div className='mb-2 flex items-center'>
            <div className='text-lg'>{20 * quantity}</div>
            <div className='ps-1 text-sm text-gray-500'> devices</div>
          </div>
          <div className='mb-2 flex items-center'>
            <div className='text-lg'>${price * quantity}</div>
            <div className='ps-1 text-sm text-gray-500'> per {periodShort}</div>
          </div>
          <div className='mb-6 flex'>
            <div className='smaller-text text-sm text-gray-500'>
              {quantity} Seats, ${price} per seat per {periodShort}
            </div>
          </div>
          <div className='grow-1' />
          <div>
            <Button
              className='ml-auto mt-3'
              disabled={billingLoading}
              onClick={() => gotoPortal()}
              type='button'
              variant='primary'
            >
              {!billingLoading && (
                <MdOutlineSubscriptions className='button-icon' />
              )}
              {billingLoading && <Spinner className='button-icon' />}
              Manage
            </Button>
          </div>
        </div>
      )}
      {!loading && trialMode && (
        <div className='flex flex-col'>
          <div className='mb-2 flex items-center'>
            <div className='text-xl font-bold'>Trial Mode</div>
          </div>
          <div className='mb-2 flex items-center'>
            <div className='text-lg'>10</div>
            <div className='ps-1 text-sm text-gray-500'> devices</div>
          </div>
          <div className='mb-6 flex'>
            <div className='smaller-text text-sm text-gray-500'>
              {trialDaysLeft} day{trialDaysLeft > 1 ? 's' : ''} left
            </div>
          </div>
          <div className='grow-1' />
          <div>
            <Button
              className='ml-auto mt-3'
              disabled={billingLoading}
              onClick={() => (window.location.href = '/pricing')}
              type='button'
              variant='primary'
            >
              {!billingLoading && (
                <MdOutlineSubscriptions className='button-icon' />
              )}
              {billingLoading && <Spinner className='button-icon' />}
              Change Subscription
            </Button>
          </div>
        </div>
      )}
      {!loading && invalid && (
        <div className='flex flex-col dark:text-gray-100'>
          No Active Plan
          <Button
            className='ml-auto mt-3'
            disabled={billingLoading}
            onClick={() => (window.location.href = '/pricing')}
            type='button'
            variant='primary'
          >
            {!billingLoading && (
              <MdOutlineSubscriptions className='button-icon' />
            )}
            {billingLoading && <Spinner className='button-icon' />}
            Manage
          </Button>
        </div>
      )}
    </div>
  );
}
