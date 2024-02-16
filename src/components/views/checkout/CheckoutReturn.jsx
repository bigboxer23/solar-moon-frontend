import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { checkoutStatus } from '../../../services/services';
import Loader from '../../common/Loader';

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      'session_id',
    );

    checkoutStatus(sessionId)
      .then(({ data }) => {
        setStatus(data.status);
        setLoading(false);
        setCustomerEmail(data.customer_email);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);
  if (status === 'open') {
    return <Navigate to='/checkout' />;
  }

  return (
    <div className='my-8 flex max-w-full flex-col items-center'>
      <div className='flex w-full flex-wrap justify-center'>
        <div>
          {loading && <Loader />}
          {status === 'complete' && (
            <main className='fade-in my-8 w-[25rem] max-w-full rounded-lg bg-white p-6 shadow-panel dark:bg-gray-800 sm:w-[55rem] sm:p-8'>
              <p>
                Thank you, we appreciate your business!
                <br />
                <br />A confirmation email will be sent to {customerEmail}.
                <br />
                <br /> If you have any questions, please email{' '}
                <a
                  className='underline'
                  href='mailto:info@solarmoonanalytics.com'
                >
                  info@solarmoonanalytics.com
                </a>
                .
              </p>
            </main>
          )}
        </div>
      </div>
    </div>
  );
};
export default Return;
