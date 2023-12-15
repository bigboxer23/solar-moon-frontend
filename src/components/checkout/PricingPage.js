import { useState } from 'react';
import { Card, CardBody } from 'react-bootstrap';
import { createSearchParams, useNavigate } from 'react-router-dom';

import logo from '../../assets/logo.svg';
import PriceTile from './PriceTile';

function PricingPage() {
  const navigate = useNavigate();
  const [monCount, setMonCount] = useState(1);
  const [yearCount, setYearCount] = useState(1);

  const checkoutClicked = (price, count) => {
    navigate({
      pathname: '/checkout',
      search: createSearchParams({
        price: price,
        count: count,
      }).toString(),
    });
  };

  return (
    <div className='pricing-page min-vh-95 container'>
      <div className='d-flex ps-5'>
        <img alt='brand' className='img-fluid logo' src={logo} />
        <div className='h4 p-4'>Choose a billing plan</div>
      </div>
      <div className='d-flex justify-content-center me-3 ms-3 flex-wrap'>
        <PriceTile
          checkoutClicked={checkoutClicked}
          count={monCount}
          label='Monthly'
          label2='mo'
          label3=''
          price={40}
          priceId={process.env.REACT_APP_PRICE_MO}
          setCount={setMonCount}
        />
        <PriceTile
          checkoutClicked={checkoutClicked}
          count={yearCount}
          label='Yearly'
          label2='yr'
          label3='Save 10%!'
          price={432}
          priceId={process.env.REACT_APP_PRICE_YR}
          setCount={setYearCount}
        />
      </div>
      <Card className='grow-1 m-5'>
        <CardBody>
          <div className='h5 align-self-start'>Plans include:</div>
          <div className='text-muted'>
            <ul>
              <li>Up to 20 devices per seat</li>
              <li>Site level data via virtual devices</li>
              <li>Live data reporting</li>
              <li>Historic data export</li>
              <li>Device alerting via email</li>
              <li>Periodic account digest</li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default PricingPage;
