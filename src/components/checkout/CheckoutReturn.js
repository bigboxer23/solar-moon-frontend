import { useEffect, useState } from 'react';
import { Card, CardBody } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

import { checkoutStatus } from '../../services/services';
import Loader from '../common/Loader';

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

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

  if (status === 'complete') {
    return (
      <div className='root-page min-vh-95 container'>
        <Card className='m-3'>
          <CardBody>
            <Loader content='' deviceCount={0} loading={loading} />
            <section id='success'>
              <p>
                We appreciate your business! A confirmation email will be sent
                to {customerEmail}. If you have any questions, please email{' '}
                <a href='mailto:info@solarmoonanalytics.com'>
                  info@solarmoonanalytics.com
                </a>
                .
              </p>
            </section>
          </CardBody>
        </Card>
      </div>
    );
  }
  return (
    <div className='root-page min-vh-95 container'>
      <Card className='m-3'>
        <CardBody>
          <Loader content='' deviceCount={0} loading={true} />
        </CardBody>
      </Card>
    </div>
  );
};
export default Return;
