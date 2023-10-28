import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardBody } from "react-bootstrap";

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    fetch(`/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === "open") {
    return <Navigate to="/checkout" />;
  }

  if (status === "complete") {
    return (
      <div className={"root-page min-vh-95 container"}>
        <Card>
          <CardBody>
            <section id="success">
              <p>
                We appreciate your business! A confirmation email will be sent
                to {customerEmail}. If you have any questions, please email{" "}
                <a href="mailto:orders@solarmoonanalytics.com">
                  orders@solarmoonanalytics.com
                </a>
                .
              </p>
            </section>
          </CardBody>
        </Card>
      </div>
    );
  }

  return null;
};
export default Return;
