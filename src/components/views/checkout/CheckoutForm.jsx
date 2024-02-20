import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { NavLink, useSearchParams } from 'react-router-dom';

import { checkout } from '../../../services/services';
import Loader from '../../common/Loader';
import HeaderBar from '../../nav/HeaderBar';

const CheckoutForm = () => {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);
  const [loading, setLoading] = useState(true);

  const [clientSecret, setClientSecret] = useState('');

  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Create a Checkout Session as soon as the page loads
    checkout(searchParams.get('price'), Number(searchParams.get('count')))
      .then(({ data }) => {
        setLoading(false);
        setClientSecret(data.clientSecret);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <HeaderBar headerText='Enter payment details' />
      <main className='flex w-full flex-col items-center justify-center py-8'>
        <div className='fade-in flex w-[55rem] max-w-full flex-col dark:bg-gray-800 sm:rounded-lg '>
          <NavLink
            className='mb-4 flex items-center self-start text-sm text-gray-500 hover:underline dark:text-gray-400'
            to='/pricing'
          >
            <FaArrowLeft className='mr-2 inline-block' size='12' />
            <span>Back to plans</span>
          </NavLink>
        </div>
        {loading && <Loader className='self-center' />}
        <EmbeddedCheckoutProvider
          options={{ clientSecret }}
          stripe={stripePromise}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </main>
    </div>
  );
};
export default CheckoutForm;
