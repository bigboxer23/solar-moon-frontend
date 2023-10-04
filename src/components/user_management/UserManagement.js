import React, { useEffect, useState } from "react";
import { getCustomer, updateCustomer } from "../../services/services";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { BiCopy } from "react-icons/bi";
import { useCopyToClipboard } from "usehooks-ts";
import { MdOutlineDelete } from "react-icons/md";

const UserManagement = () => {
  const [customerData, setCustomerData] = useState({});
  const [value, copy] = useCopyToClipboard();
  useEffect(() => {
    getCustomer()
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
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                readOnly={true}
                value={customerData?.email || ""}
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={customerData?.name || ""}
                onChange={(e) =>
                  setCustomerData({ ...customerData, name: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      <Card className={"m-5"}>
        <Card.Header className={"fw-bold"}>Billing Information</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formGridCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control
                placeholder="United States of America"
                value={customerData?.country || ""}
                onChange={(e) =>
                  setCustomerData({ ...customerData, country: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Address</Form.Label>
              <Form.Control
                placeholder="1234 Main St"
                value={customerData?.address1 || ""}
                onChange={(e) =>
                  setCustomerData({ ...customerData, address1: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGridAddress2">
              <Form.Label>Address 2</Form.Label>
              <Form.Control
                placeholder="Apartment, studio, or floor"
                value={customerData?.address2 || ""}
                onChange={(e) =>
                  setCustomerData({ ...customerData, address2: e.target.value })
                }
              />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  value={customerData?.city || ""}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, city: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>State, County, Province, or Region</Form.Label>
                <Form.Control
                  value={customerData?.state || ""}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, state: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Zip</Form.Label>
                <Form.Control
                  value={customerData?.zip || ""}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, zip: e.target.value })
                  }
                />
              </Form.Group>
            </Row>
            <Button
              variant="primary"
              type="button"
              onClick={() => updateCustomer(customerData)}
            >
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Card className={"m-5"}>
        <Card.Header className={"fw-bold"}>Payment Information</Card.Header>
        <Card.Body>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
        </Card.Body>
      </Card>
      <Card className={"m-5"}>
        <Card.Header className={"fw-bold"}>API Information</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3 " controlId="formAccessKey">
              <Form.Label>Access Key</Form.Label>
              <br />
              <Form.Text className="text-muted">
                This key identifies your account and allows devices to push data
                to the platform.
              </Form.Text>
              <Row className={"flex-nowrap ms-0 me-0"}>
                <Form.Control
                  placeholder="Access Key"
                  readOnly={true}
                  className={"flex-grow-1 w-auto"}
                  value={customerData?.accessKey || ""}
                />
                <Button
                  type={"button"}
                  className={"ms-2 w-auto"}
                  onClick={() => copy(customerData?.accessKey)}
                >
                  <BiCopy style={{ marginBottom: "2px" }} />
                </Button>
              </Row>
            </Form.Group>
            <Button
              type={"button"}
              onClick={() => console.log("todo")}
              variant={"danger"}
            >
              <MdOutlineDelete
                style={{ marginBottom: "2px", marginRight: "6px" }}
              />
              Revoke/Regenerate Access Key
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
