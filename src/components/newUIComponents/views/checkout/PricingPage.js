import { useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';

import logo from '../../../../assets/logo.svg';
import PriceTile from './PriceTile';

export default function PricingPage() {
  const navigate = useNavigate();
  const [monCount, setMonCount] = useState(1);
  const [yearCount, setYearCount] = useState(1);

  const checkoutClicked = (price, count) => {
    navigate({
      pathname: '/checkout',
      search: createSearchParams({
        price: price,
        count: count,
      }).toString(),
    });
  };

  return (
    <div className='pricing-page'>
      <div className='Navbar2 flex h-[4.5rem] w-full items-center border-b border-text-secondary bg-brand-primary-light sm:h-[6.25rem]'>
        <div className='flex items-center justify-center'>
          <img
            alt='brand'
            className='ml-6 h-10 w-10 sm:ml-8 sm:h-12 sm:w-12'
            src={logo}
          />
        </div>
        <div className='ms-4 flex items-center'>
          <span className='text-xl font-bold'>Choose a billing plan</span>
        </div>
      </div>
      <div className='my-8 flex max-w-full flex-col items-center'>
        <div className='flex w-full flex-wrap justify-center'>
          <PriceTile
            checkoutClicked={checkoutClicked}
            count={monCount}
            label='Monthly'
            label2='mo'
            label3=''
            price={40}
            priceId={process.env.REACT_APP_PRICE_MO}
            setCount={setMonCount}
          />
          <PriceTile
            checkoutClicked={checkoutClicked}
            count={yearCount}
            label='Yearly'
            label2='yr'
            label3='Save 10%'
            price={432}
            priceId={process.env.REACT_APP_PRICE_YR}
            setCount={setYearCount}
          />
        </div>
        <div className='fade-in my-8 w-[25rem] max-w-full rounded-lg bg-white p-6 shadow-panel sm:w-[55rem] sm:p-8'>
          <div>
            <div className='align-self-start mb-4 text-lg font-bold'>
              Plans include
            </div>
            <div className='ms-4 text-gray-500'>
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
        </div>
      </div>
    </div>
  );
}
