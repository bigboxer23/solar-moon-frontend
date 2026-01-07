import React, { useEffect, useState } from 'react';
import { MdOutlineSubscriptions } from 'react-icons/md';

import {
  getStripeSubscriptions,
  getSubscriptionInformation,
  getUserPortalSession,
} from '../../../services/services';
import type { BillingPortalSessionResponse } from '../../../types/api';
import { getDaysLeftInTrial } from '../../../utils/Utils';
import Button from '../../common/Button';
import Loader from '../../common/Loader';
import Spinner from '../../common/Spinner';

export default function ManagePlanTile(): React.ReactElement {
  const [billingLoading, setBillingLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(0);
  const [period, setPeriod] = useState<string>('');
  const [periodShort, setPeriodShort] = useState<string>('');
  const [price, setPrice] = useState<number>(40);
  const [loading, setLoading] = useState<boolean>(true);
  const [invalid, setInvalid] = useState<boolean>(false);
  const [trialMode, setTrialMode] = useState<boolean>(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState<string>('90 days left');

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
          setTrialDaysLeft(getDaysLeftInTrial(data?.joinDate));
        });
        return;
      }
      const [subscription] = data;
      if (subscription) {
        setQuantity(subscription.quantity || 0);
        setPeriod(subscription.interval === 'month' ? 'Monthly' : 'Yearly');
        setPeriodShort(subscription.interval === 'month' ? 'mo' : 'yr');
        setPrice(subscription.interval === 'month' ? 40 : 432);
      }
      setLoading(false);
    });
  }, []);

  const gotoPortal = (): void => {
    setBillingLoading(true);
    getUserPortalSession()
      .then(({ data }: { data: BillingPortalSessionResponse }) => {
        setBillingLoading(false);
        window.location.href = data.url;
      })
      .catch(() => {
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
        <div className='flex flex-col dark:text-gray-100'>
          <div className='mb-2 flex items-center'>
            <div className='text-xl font-bold'>{period}</div>
          </div>
          <div className='mb-2 flex items-center'>
            <div className='text-lg'>{20 * quantity}</div>
            <div className='ps-1 text-sm text-gray-400'> devices</div>
          </div>
          <div className='mb-2 flex items-center'>
            <div className='text-lg'>${price * quantity}</div>
            <div className='ps-1 text-sm text-gray-400'> per {periodShort}</div>
          </div>
          <div className='mb-6 flex'>
            <div className='smaller-text text-sm text-gray-400'>
              {quantity} Seats, ${price} per seat per {periodShort}
            </div>
          </div>
          <div className='grow-1' />
          <div>
            <Button
              buttonProps={{ type: 'button' }}
              className='ml-auto mt-3'
              disabled={billingLoading}
              onClick={() => gotoPortal()}
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
        <div className='flex flex-col dark:text-gray-100'>
          <div className='mb-2 flex items-center'>
            <div className='text-xl font-bold '>Trial Mode</div>
          </div>
          <div className='mb-2 flex items-center'>
            <div className='text-lg'>10</div>
            <div className='ps-1 text-sm text-gray-400'> devices</div>
          </div>
          <div className='mb-6 flex'>
            <div className='smaller-text text-sm text-gray-400'>
              {trialDaysLeft}
            </div>
          </div>
          <div className='grow-1' />
          <div>
            <Button
              buttonProps={{ type: 'button' }}
              className='ml-auto mt-3'
              disabled={billingLoading}
              onClick={() => (window.location.href = '/pricing')}
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
            buttonProps={{ type: 'button' }}
            className='ml-auto mt-3'
            disabled={billingLoading}
            onClick={() => (window.location.href = '/pricing')}
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
