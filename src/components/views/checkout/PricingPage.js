import { useEffect, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';

import { MONTH } from '../../../services/search';
import {
  activateTrial,
  getSubscriptionInformation,
} from '../../../services/services';
import HeaderBar from '../../nav/HeaderBar';
import PriceTile from './PriceTile';

export default function PricingPage() {
  const navigate = useNavigate();
  const [monCount, setMonCount] = useState(1);
  const [yearCount, setYearCount] = useState(1);
  const [trialAvailable, setTrialAvailable] = useState(false);
  const [trialOver, setTrialOver] = useState(false);

  useEffect(() => {
    getSubscriptionInformation().then(({ data }) => {
      setTrialAvailable(
        data?.packs === 0 && data?.joinDate >= new Date().getTime() - MONTH * 3,
      );
      setTrialOver(
        data?.packs === -1 && data?.joinDate < new Date().getTime() - MONTH * 3,
      );
    });
  }, []);

  const checkoutClicked = (price, count) => {
    navigate({
      pathname: '/checkout',
      search: createSearchParams({
        price: price,
        count: count,
      }).toString(),
    });
  };

  const trialClicked = (price, count) => {
    activateTrial().then(() => {
      navigate('/manage');
    });
  };
  return (
    <div className='pricing-page'>
      <HeaderBar headerText='Choose a billing plan' />
      <div className='my-8 flex max-w-full flex-col items-center'>
        {trialOver && (
          <div className='flex w-full flex-wrap justify-center px-8 text-lg dark:text-gray-100'>
            Thank you for trialing Solar Moon Analytics. Please upgrade to a
            paid plan to continue accessing your devices.
          </div>
        )}
        <div className='flex w-full flex-wrap justify-center'>
          {trialAvailable && (
            <PriceTile
              buttonText='Choose trial'
              checkoutClicked={trialClicked}
              count={0.5}
              label='Trial'
              label2='for first 90 days'
              label3='Free!'
              price={0}
              priceId={process.env.REACT_APP_PRICE_MO}
              setCount={setMonCount}
              showBottomContent={false}
            />
          )}
          <PriceTile
            checkoutClicked={checkoutClicked}
            count={monCount}
            label='Monthly'
            label2='per mo'
            label3=''
            price={40}
            priceId={process.env.REACT_APP_PRICE_MO}
            setCount={setMonCount}
          />
          <PriceTile
            checkoutClicked={checkoutClicked}
            count={yearCount}
            label='Yearly'
            label2='per yr'
            label3='Save 10%'
            price={432}
            priceId={process.env.REACT_APP_PRICE_YR}
            setCount={setYearCount}
          />
        </div>
        <div className='fade-in my-8 w-[25rem] max-w-full rounded-lg bg-white p-6 shadow-panel dark:bg-gray-800 sm:w-[55rem] sm:p-8'>
          <div>
            <div className='align-self-start mb-4 text-lg font-bold text-black dark:text-gray-100'>
              Plans include
            </div>
            <div className='ms-4 text-gray-500 dark:text-gray-400'>
              <ul className='list-disc'>
                <li>Up to 20 devices per seat</li>
                <li>Site level data via virtual devices</li>
                <li>Live data reporting</li>
                <li>Historic data export</li>
                <li>Device alerting via email</li>
                <li>Periodic account digest</li>
              </ul>
            </div>
          </div>
          <div>
            <div className='align-self-start my-4 text-lg font-bold text-black dark:text-gray-100'>
              Trial include
            </div>
            <div className='ms-4 text-gray-500 dark:text-gray-400'>
              <ul className='list-disc'>
                <li>All features from paid plans</li>
                <li>Up to 10 devices</li>
                <li>Limited to 90 days</li>
                <li>
                  all devices and data is retained after trial ends, but you
                  must choose a paid plan to access it
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
