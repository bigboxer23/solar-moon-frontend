import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Dropdown } from 'react-bootstrap';

import { DAY } from '../../services/search';
import { getDevices } from '../../services/services';
import { sortDevices, useStickyState } from '../../utils/Utils';
import Loader from '../common/Loader';
import PeriodToggle from '../common/PeriodToggle';
import SiteGraph from '../graphs/SiteGraph';
import TimeSeries from '../graphs/TimeSeries';
import { noSite } from '../sites/SiteManagement';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [activeSite, setActiveSite] = useStickyState(noSite, 'dashboard.site');
  const [time, setTime] = useStickyState(DAY, 'dashboard.time');

  useEffect(() => {
    getDevices()
      .then(({ data }) => {
        setDevices(data);
        setLoading(false);
        if (activeSite === noSite) {
          setActiveSite(data.find((device) => device.virtual)?.name || noSite);
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);
  return (
    <div className='root-page d-flex flex-column min-vh-95 container'>
      <Card className='site-attributes'>
        <CardHeader className='d-flex align-items-center flex-wrap'>
          <div className='fs-3 site-name'>{activeSite}</div>
          <div className='grow-1' />
          <Dropdown className='align-self-end'>
            <Dropdown.Toggle id='dropdown-basic' variant='primary'>
              {activeSite}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {devices
                .filter((device) => device.virtual)
                .map((site) => {
                  return (
                    <Dropdown.Item
                      as='button'
                      key={site.name + time}
                      onClick={() => setActiveSite(site.name)}
                    >
                      {site.name}
                    </Dropdown.Item>
                  );
                })}
              <Dropdown.Item
                as='button'
                key='none'
                onClick={() => setActiveSite(noSite)}
              >
                {noSite}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <PeriodToggle setTime={setTime} time={time} />
        </CardHeader>
        <CardBody>
          <Loader
            content={
              'You don\'t have any devices yet.  Add some by navigating to the "Sites" section above!'
            }
            deviceCount={devices.length}
            loading={loading}
          />
          {devices
            .filter((device) => device.virtual)
            .filter((device) => device.site === activeSite)
            .map((device) => {
              return <SiteGraph key={device.id} site={device} time={time} />;
            })}
          {devices
            .filter((device) => !device.virtual)
            .filter((device) => device.site === activeSite)
            .sort(sortDevices)
            .map((device) => {
              return <TimeSeries device={device} key={device.id} time={time} />;
            })}
        </CardBody>
      </Card>
    </div>
  );
};

export default Dashboard;
