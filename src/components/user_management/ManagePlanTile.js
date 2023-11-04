import { Button, Card, CardBody, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import {
  getSubscriptions,
  getUserPortalSession,
} from "../../services/services";

function ManagePlanTile() {
  const [billingLoading, setBillingLoading] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [period, setPeriod] = useState("");
  const [periodShort, setPeriodShort] = useState("");
  const [price, setPrice] = useState(0);

  useEffect(() => {
    getSubscriptions().then(({ data }) => {
      setQuantity(data[0].quantity);
      setPeriod(data[0].interval === "month" ? "Monthly" : "Yearly");
      setPeriodShort(data[0].interval === "month" ? "mo" : "yr");
      setPrice(data[0].interval === "month" ? 50 : 540);
    });
  }, []);
  const gotoPortal = () => {
    setBillingLoading(true);
    getUserPortalSession()
      .then(({ data }) => {
        setBillingLoading(false);
        window.location.href = data;
      })
      .catch((e) => {
        setBillingLoading(false);
      });
  };
  return (
    <Card className={"price"}>
      <CardBody className={"d-flex flex-column"}>
        <div className={"d-flex mb-3 align-items-center"}>
          <div className={"h3"}>{period}</div>
        </div>
        <div className={"d-flex mb-1 align-content-center"}>
          <div className={"h5 "}>{10 * quantity}</div>
          <div className={"text-muted ps-1"}> devices</div>
        </div>
        <div className={"d-flex mb-1 align-content-center"}>
          <div className={"h5"}>${price * quantity}</div>
          <div className={"text-muted ps-1"}> per {periodShort}</div>
        </div>
        <div className={"d-flex mb-3"}>
          <div className={"text-muted smaller-text ps-1"}>
            {quantity} Seats, ${price} per seat per {periodShort}
          </div>
        </div>
        <div className={"flex-grow-1"} />
        <Button
          className={billingLoading ? "mt-3 disabled" : "mt-3"}
          variant="primary"
          type="button"
          onClick={() => gotoPortal()}
        >
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            className={"me-2 d-none"}
          />
          Manage
        </Button>
      </CardBody>
    </Card>
  );
}
export default ManagePlanTile;
