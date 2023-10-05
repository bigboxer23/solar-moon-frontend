import React, { useEffect, useState } from "react";
import {
  getCustomer as fetchCustomer,
  updateCustomer as updateRemoteCustomer,
} from "../../services/services";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { MdOutlineDelete } from "react-icons/md";
import { TbUserCancel } from "react-icons/tb";
import CopyButton from "../CopyButton";
import ChangePassword from "./ChangePassword";

const UserManagement = () => {
  const [customerData, setCustomerData] = useState({});
  const [accessKeyWarning, setAccessKeyWarning] = useState(false);
  const [deleteAcctWarning, setDeleteAcctWarning] = useState(false);
  useEffect(() => {
    getCustomer();
  }, []);

  const getCustomer = () => {
    fetchCustomer()
      .then(({ data }) => {
        setCustomerData(data);
      })
      .catch((e) => console.log("e " + e));
  };
  const updateCustomer = (target, dataToUpdate) => {
    target.classList.add("disabled");
    updateRemoteCustomer(dataToUpdate != null ? dataToUpdate : customerData)
      .then(({ data }) => {
        setCustomerData(data);
        target.classList.remove("disabled");
      })
      .catch((e) => console.log("e: " + e));
  };

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
              onClick={(e) => updateCustomer(e.target)}
            >
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                className={"me-2 d-none"}
              />
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
                <CopyButton
                  title={"Copy Access Key"}
                  dataSrc={() => customerData?.accessKey}
                />
              </Row>
            </Form.Group>
            <Button
              type={"button"}
              onClick={() => setAccessKeyWarning(true)}
              variant={"danger"}
              id={"revokeAccessKey"}
            >
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                className={"me-2 d-none"}
              />
              <MdOutlineDelete
                style={{ marginBottom: "2px", marginRight: "6px" }}
              />
              Revoke/Regenerate Access Key
            </Button>
            <Alert show={accessKeyWarning} variant="danger">
              <Alert.Heading>Revoke/Regenerate Access Key</Alert.Heading>
              <p>
                Are you sure you want to revoke this key? Doing so is
                non-reversible.
              </p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button
                  onClick={() => setAccessKeyWarning(false)}
                  variant="outline-secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setAccessKeyWarning(false);
                    updateCustomer(document.getElementById("revokeAccessKey"), {
                      ...customerData,
                      accessKey: "",
                    });
                  }}
                  variant="outline-danger"
                  className={"ms-2"}
                >
                  Revoke Key
                </Button>
              </div>
            </Alert>
          </Form>
        </Card.Body>
      </Card>
      <ChangePassword />
      <Card className={"m-5"}>
        <Card.Header className={"fw-bold"}>Delete Account</Card.Header>
        <Card.Body>
          <Button
            type={"button"}
            onClick={() => setDeleteAcctWarning(true)}
            variant={"danger"}
          >
            <TbUserCancel style={{ marginBottom: "2px", marginRight: "6px" }} />
            Delete Account
          </Button>
          <Alert show={deleteAcctWarning} variant="danger">
            <Alert.Heading>Delete Account</Alert.Heading>
            <p>
              Are you sure you want to delete your account? Doing so is
              non-reversible.
            </p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button
                onClick={() => setDeleteAcctWarning(false)}
                variant="outline-secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setDeleteAcctWarning(false);
                  updateCustomer({ ...customerData, active: false });
                }}
                variant="outline-danger"
                className={"ms-2"}
              >
                Delete Account
              </Button>
            </div>
          </Alert>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserManagement;
