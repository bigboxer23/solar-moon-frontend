import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import logo from '../../../../assets/logo.svg';
import { checkout } from '../../../../services/services';
import Loader from '../../common/Loader';

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
      <div className='Navbar2 flex h-[4.5rem] w-full items-center border-b border-text-secondary bg-brand-primary-light sm:h-[6.25rem]'>
        <div className='flex items-center justify-center'>
          <img
            alt='brand'
            className='ml-6 h-10 w-10 sm:ml-8 sm:h-12 sm:w-12'
            src={logo}
          />
        </div>
        <div className='ms-4 flex items-center'>
          <span className='text-xl font-bold'>Enter payment details</span>
        </div>
      </div>
      <div className='flex justify-center'>
        {loading && <Loader className='justify-center' />}
        <EmbeddedCheckoutProvider
          options={{ clientSecret }}
          stripe={stripePromise}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
};
export default CheckoutForm;
