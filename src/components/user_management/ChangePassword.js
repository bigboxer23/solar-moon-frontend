import { Auth } from 'aws-amplify';
import { useState } from 'react';
import {
  Button,
  Card,
  Form,
  Spinner,
  Toast,
  ToastBody,
  ToastContainer,
} from 'react-bootstrap';
import { MdOutlinePassword } from 'react-icons/md';

const ChangePassword = () => {
  const [password, setPassword] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    let confirm = document.getElementById('formConfirmNewPassword');

    setError('');
    confirm.setCustomValidity('');
    if (
      form.checkValidity() === false ||
      password.confirmNewPassword !== password.newPassword
    ) {
      if (password.confirmNewPassword !== password.newPassword) {
        confirm.setCustomValidity('New password does not match!');
        setError('New password does not match!');
      }
    } else {
      changePassword(password.oldPassword, password.newPassword);
    }
    setValidated(true);
  };

  async function changePassword(oldPassword, newPassword) {
    let button = document.getElementById('changePasswordSubmit');

    try {
      button.classList.add('disabled');
      const user = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(user, oldPassword, newPassword);
      setShowToast(true);
    } catch (err) {
      let confirm = document.getElementById('formConfirmNewPassword');
      confirm.setCustomValidity('New password does not match!');
      setError(err.message);
      console.log(err);
    }
    button.classList.remove('disabled');
  }

  return (
    <Card className='m-5'>
      <Card.Header className='fw-bold'>Change Password</Card.Header>
      <Card.Body>
        <Form
          id='changePWForm'
          noValidate
          onSubmit={handleSubmit}
          validated={validated}
        >
          <Form.Group className='mb-3' controlId='formOldPassword'>
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              onChange={(e) =>
                setPassword({ ...password, oldPassword: e.target.value })
              }
              placeholder='Old Password'
              required
              type='password'
            />
          </Form.Group>
          <Form.Group controlId='formNewPassword'>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              onChange={(e) =>
                setPassword({ ...password, newPassword: e.target.value })
              }
              placeholder='New Password'
              required
              type='password'
            />
          </Form.Group>
          <Form.Group controlId='formConfirmNewPassword'>
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              onChange={(e) =>
                setPassword({ ...password, confirmNewPassword: e.target.value })
              }
              placeholder='Confirm New Password'
              required
              type='password'
            />
            <Form.Control.Feedback type='invalid'>
              {error}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            className='mt-3 '
            id='changePasswordSubmit'
            type='submit'
            variant='primary'
          >
            <Spinner
              animation='border'
              as='span'
              className='d-none me-2'
              role='status'
              size='sm'
            />
            <MdOutlinePassword className='button-icon' />
            Change Password
          </Button>
        </Form>
        <ToastContainer position='bottom-end'>
          <Toast
            autohide
            bg='success'
            className='m-2'
            delay={2500}
            onClose={() => setShowToast(false)}
            show={showToast}
          >
            <ToastBody>Password successfully updated!</ToastBody>
          </Toast>
        </ToastContainer>
      </Card.Body>
    </Card>
  );
};
export default ChangePassword;
