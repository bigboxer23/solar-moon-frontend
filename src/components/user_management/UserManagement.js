import React, { useEffect, useState } from "react";
import { getCustomerInfo } from "../../services/services";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { BiCopy } from "react-icons/bi";
import { useCopyToClipboard } from "usehooks-ts";

const UserManagement = () => {
  const [customerData, setCustomerData] = useState("Loading");
  const [value, copy] = useCopyToClipboard();
  useEffect(() => {
    getCustomerInfo()
      .then(({ data }) => {
        setCustomerData(data);
      })
      .catch((e) => {
        console.log("e " + e);
      });
  }, []);

  return (
    <div className={"root-page container"}>
      <Card className={"m-5"}>
        <Card.Header className={"fw-bold"}>Customer Information</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                readOnly={true}
                value={customerData?.email || ""}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Access Key</Form.Label>
              <br />
              <Form.Text className="text-muted">
                This key allows devices to push data to the platform.
              </Form.Text>
              <Form.Control
                placeholder="Access Key"
                readOnly={true}
                value={customerData?.accessKey || ""}
              />
              <BiCopy
                style={{ marginBottom: "2px" }}
                onClick={() => copy(customerData?.accessKey)}
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      <Card className={"m-5"}>
        <Card.Header className={"fw-bold"}>Billing Information</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Address</Form.Label>
              <Form.Control placeholder="1234 Main St" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGridAddress2">
              <Form.Label>Address 2</Form.Label>
              <Form.Control placeholder="Apartment, studio, or floor" />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>City</Form.Label>
                <Form.Control />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>State</Form.Label>
                <Form.Select defaultValue="Choose...">
                  <option>Choose...</option>
                  <option>...</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Zip</Form.Label>
                <Form.Control />
              </Form.Group>
            </Row>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Card className={"m-5"}>
        <Card.Header className={"fw-bold"}>Password Reset</Card.Header>
        <Card.Body>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserManagement;
