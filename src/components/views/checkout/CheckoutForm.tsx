import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { NavLink, useSearchParams } from 'react-router-dom';

import { checkout } from '../../../services/services';
import Loader from '../../common/Loader';
import HeaderBar from '../../nav/HeaderBar';

const CheckoutForm = (): React.ReactElement => {
  const stripePromise: Promise<Stripe | null> = loadStripe(
    import.meta.env.VITE_STRIPE_PK as string,
  );
  const [loading, setLoading] = useState<boolean>(true);

  const [clientSecret, setClientSecret] = useState<string>('');

  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Create a Checkout Session as soon as the page loads
    checkout(
      searchParams.get('price') as string,
      Number(searchParams.get('count')),
    )
      .then(({ data }) => {
        setLoading(false);
        setClientSecret(data.clientSecret);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [searchParams]);

  return (
    <div>
      <HeaderBar headerText='Enter payment details' />
      <main className='flex w-full flex-col py-8'>
        <div className='fade-in ml-6 flex w-[55rem] max-w-full flex-col dark:bg-gray-800 sm:ml-8 sm:rounded-lg'>
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
