import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
      <div className='flex w-full flex-col py-8'>
        {loading && <Loader className='self-center' />}
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
