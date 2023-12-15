import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from 'react-bootstrap';

import { DAY } from '../../services/search';
import { getDevices } from '../../services/services';
import { useStickyState } from '../../utils/Utils';
import Loader from '../common/Loader';
import PeriodToggle from '../common/PeriodToggle';
import MetricsTile from '../graphs/MetricsTile';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuthenticator((context) => [context.user]);
  const [devices, setDevices] = useState([]);
  const [time, setTime] = useStickyState(DAY, 'dashboard.time');

  const [unlocked, _] = useStickyState(null, 'unlock.code');
  useEffect(() => {
    if (maybeRedirect()) {
      return;
    }
    getDevices()
      .then(({ data }) => {
        setLoading(false);
        setDevices(data);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  const maybeRedirect = () => {
    if (
      process.env.REACT_APP_ACCESS_CODE &&
      process.env.REACT_APP_ACCESS_CODE !== unlocked
    ) {
      window.location.href = '/lock';
      return true;
    }
    return false;
  };

  return (
    <div className='root-page min-vh-95 container'>
      <Card>
        <CardHeader className='d-flex align-items-center'>
          <div className='welcome'>Hello {user.attributes.email}!</div>
          <div className='grow-1' />
          <PeriodToggle setTime={setTime} time={time} />
        </CardHeader>
        <CardBody className='d-flex justify-content-center flex-wrap'>
          <Loader
            content={
              "You don't have any sites or devices yet.  Why don't you add some by clicking the sites link above?"
            }
            deviceCount={devices.length}
            loading={loading}
          />
          {devices
            .filter((device) => device.virtual)
            .map((device) => {
              return (
                <MetricsTile device={device} key={device.id} time={time} />
              );
            })}
        </CardBody>
      </Card>
    </div>
  );
};

export default Home;
