import {
  Button,
  Card,
  Form,
  Spinner,
  Toast,
  ToastBody,
  ToastContainer,
} from "react-bootstrap";
import React, { useState } from "react";
import { Auth } from "aws-amplify";

const ChangePassword = () => {
  const [password, setPassword] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    let confirm = document.getElementById("formConfirmNewPassword");

    setError("");
    confirm.setCustomValidity("");
    if (
      form.checkValidity() === false ||
      password.confirmNewPassword !== password.newPassword
    ) {
      if (password.confirmNewPassword !== password.newPassword) {
        confirm.setCustomValidity("New password does not match!");
        setError("New password does not match!");
      }
    } else {
      changePassword(password.oldPassword, password.newPassword);
    }
    setValidated(true);
  };

  async function changePassword(oldPassword, newPassword) {
    let button = document.getElementById("changePasswordSubmit");

    try {
      button.classList.add("disabled");
      const user = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(user, oldPassword, newPassword);
      setShowToast(true);
    } catch (err) {
      let confirm = document.getElementById("formConfirmNewPassword");
      confirm.setCustomValidity("New password does not match!");
      setError(err.message);
      console.log(err);
    }
    button.classList.remove("disabled");
  }

  return (
    <Card className={"m-5"}>
      <Card.Header className={"fw-bold"}>Change Password</Card.Header>
      <Card.Body>
        <Form
          noValidate
          id={"changePWForm"}
          onSubmit={handleSubmit}
          validated={validated}
        >
          <Form.Group className="mb-3" controlId="formOldPassword">
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              required
              type={"password"}
              placeholder="Old Password"
              onChange={(e) =>
                setPassword({ ...password, oldPassword: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="formNewPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              required
              type={"password"}
              placeholder="New Password"
              onChange={(e) =>
                setPassword({ ...password, newPassword: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="formConfirmNewPassword">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              required
              type={"password"}
              placeholder="Confirm New Password"
              onChange={(e) =>
                setPassword({ ...password, confirmNewPassword: e.target.value })
              }
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            id="changePasswordSubmit"
            className="mt-3 "
            variant="primary"
            type="submit"
          >
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              className={"me-2 d-none"}
            />
            Change Password
          </Button>
        </Form>
        <ToastContainer position={"bottom-end"}>
          <Toast
            className={"m-2"}
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={2500}
            autohide
            bg={"success"}
          >
            <ToastBody>Password successfully updated!</ToastBody>
          </Toast>
        </ToastContainer>
      </Card.Body>
    </Card>
  );
};
export default ChangePassword;
