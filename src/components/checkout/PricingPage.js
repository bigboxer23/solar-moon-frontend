import { Button, Card, CardBody } from "react-bootstrap";
import logo from "../../assets/logo.svg";
import React from "react";

import { createSearchParams, useNavigate } from "react-router-dom";

function PricingPage() {
  const navigate = useNavigate();
  const checkoutClicked = (price) => {
    navigate({
      pathname: "/checkout",
      search: createSearchParams({ price: price }).toString(),
    });
  };

  return (
    <div className={"pricing-page container min-vh-95"}>
      <div className={"d-flex ps-5"}>
        <img src={logo} className="img-fluid logo" alt="brand" />
        <div className={"h4 p-4"}>Choose a billing cycle</div>
      </div>
      <div className={"d-flex ms-3 me-3 justify-content-center flex-wrap"}>
        <Card
          className={"price m-3"}
          onClick={() => checkoutClicked("price_1O6zd9A8dDzAfRCMVFwdeAyJ")}
        >
          <CardBody className={"d-flex flex-column"}>
            <div className={"d-flex mb-3 align-items-center"}>
              <div className={"h3"}>Monthly</div>
            </div>
            <div className={"d-flex mb-3"}>
              <div className={"h5"}>$50</div>
              <div className={"text-muted ps-1"}> per mo</div>
            </div>
            <div className={"flex-grow-1"} />
            <Button variant="primary" type="button">
              Choose plan
            </Button>
          </CardBody>
        </Card>
        <Card
          className={"price m-3"}
          onClick={() => checkoutClicked("price_1O6zdQA8dDzAfRCMdAdXq7Bw")}
        >
          <CardBody className={"d-flex flex-column"}>
            <div className={"d-flex mb-3 align-items-center"}>
              <div className={"h3"}>Yearly</div>
              <div className={"text-muted ps-2"}> Save 10%!</div>
            </div>
            <div className={"d-flex mb-3"}>
              <div className={"h5"}>$540</div>
              <div className={"text-muted ps-1"}> per yr</div>
            </div>
            <div className={"flex-grow-1"} />
            <Button variant="primary" type="button">
              Choose plan
            </Button>
          </CardBody>
        </Card>
      </div>
      <Card className={"flex-grow-1 m-5"}>
        <CardBody>
          <div className={"h5"}>Solar Moon Analytics Plan</div>
          <div className={"text-muted"}>
            <ul>
              <li>Connect up to 10 devices per seat</li>
              <li>Unlimited data reporting</li>
              <li>Unlimited alarms</li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default PricingPage;
