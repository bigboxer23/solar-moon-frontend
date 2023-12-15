import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import logo from '../../assets/logo.svg';
import { checkout } from '../../services/services';
import Loader from '../common/Loader';

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
    <div className='pricing-page min-vh-95 container'>
      <div className='d-flex ps-5'>
        <img alt='brand' className='img-fluid logo' src={logo} />
        <div className='h4 p-4'>Enter payment details</div>
      </div>
      <Loader content='' deviceCount={0} loading={loading} />
      <EmbeddedCheckoutProvider
        options={{ clientSecret }}
        stripe={stripePromise}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};
export default CheckoutForm;
