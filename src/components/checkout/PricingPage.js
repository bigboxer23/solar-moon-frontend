import { Card, CardBody } from 'react-bootstrap';
import logo from '../../assets/logo.svg';
import { useState } from 'react';

import { createSearchParams, useNavigate } from 'react-router-dom';
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
        <img src={logo} className='img-fluid logo' alt='brand' />
        <div className='h4 p-4'>Choose a billing plan</div>
      </div>
      <div className='d-flex justify-content-center me-3 ms-3 flex-wrap'>
        <PriceTile
          label='Monthly'
          label2='mo'
          label3=''
          count={monCount}
          setCount={setMonCount}
          price={40}
          priceId={process.env.REACT_APP_PRICE_MO}
          checkoutClicked={checkoutClicked}
        />
        <PriceTile
          label='Yearly'
          label2='yr'
          label3='Save 10%!'
          count={yearCount}
          setCount={setYearCount}
          price={432}
          priceId={process.env.REACT_APP_PRICE_YR}
          checkoutClicked={checkoutClicked}
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
