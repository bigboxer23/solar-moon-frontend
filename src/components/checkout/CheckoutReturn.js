import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardBody } from 'react-bootstrap';
import Loader from '../common/Loader';
import { checkoutStatus } from '../../services/services';

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
            <Loader loading={loading} deviceCount={0} content='' />
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
          <Loader loading={true} deviceCount={0} content='' />
        </CardBody>
      </Card>
    </div>
  );
};
export default Return;
