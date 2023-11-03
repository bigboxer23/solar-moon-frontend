import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import logo from "../../assets/logo.svg";
import { checkout } from "../../services/services";
import { useSearchParams } from "react-router-dom";
import Loader from "../common/Loader";

const CheckoutForm = () => {
  const stripePromise = loadStripe("");

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Create a Checkout Session as soon as the page loads
    checkout(searchParams.get("price"), Number(searchParams.get("count")))
      .then(({ data }) => {
        setLoading(false);
        setClientSecret(data.clientSecret);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={"pricing-page container min-vh-95"}>
      <div className={"d-flex ps-5"}>
        <img src={logo} className="img-fluid logo" alt="brand" />
        <div className={"h4 p-4"}>Enter payment details</div>
      </div>
      <Loader loading={loading} deviceCount={0} content={""} />
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};
export default CheckoutForm;
