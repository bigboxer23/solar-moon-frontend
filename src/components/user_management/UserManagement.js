import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Form, Row, Spinner } from 'react-bootstrap';
import { MdOutlineDelete } from 'react-icons/md';
import { TbUserCancel } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import {
  deleteCustomer,
  getCustomer as fetchCustomer,
  updateCustomer as updateRemoteCustomer,
} from '../../services/services';
import Loader from '../common/Loader';
import CopyButton from '../CopyButton';
import ChangePassword from './ChangePassword';
import ManagePlanTile from './ManagePlanTile';

const UserManagement = () => {
  const navigate = useNavigate();
  const { signOut } = useAuthenticator((context) => [context.user]);
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState({});
  const [accessKeyWarning, setAccessKeyWarning] = useState(false);
  const [deleteAcctWarning, setDeleteAcctWarning] = useState(false);
  useEffect(() => {
    fetchCustomer()
      .then(({ data }) => {
        setLoading(false);
        setCustomerData(data);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  const updateCustomer = (target, dataToUpdate) => {
    target.classList.add('disabled');
    updateRemoteCustomer(dataToUpdate != null ? dataToUpdate : customerData)
      .then(({ data }) => {
        setCustomerData(data);
        target.classList.remove('disabled');
      })
      .catch((e) => {
        target.classList.remove('disabled');
      });
  };

  return loading ? (
    <div className='root-page min-vh-95 container'>
      <Loader content='' deviceCount={1} loading={loading} />
    </div>
  ) : (
    <div className='root-page min-vh-95 container'>
      <Card className='m-5'>
        <Card.Header className='fw-bold'>Customer Information</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className='mb-3' controlId='formEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                placeholder='Enter email'
                readOnly={true}
                type='email'
                value={customerData?.email || ''}
              />
            </Form.Group>
            <Form.Group controlId='formName'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setCustomerData({ ...customerData, name: e.target.value })
                }
                value={customerData?.name || ''}
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      <Card className='m-5'>
        <Card.Header className='fw-bold'>Billing Information</Card.Header>
        <Card.Body>
          <ManagePlanTile />
        </Card.Body>
      </Card>
      <Card className='m-5'>
        <Card.Header className='fw-bold'>API Information</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className='mb-3 ' controlId='formAccessKey'>
              <Form.Label>Access Key</Form.Label>
              <br />
              <Form.Text className='text-muted'>
                This key identifies your account and allows devices to push data
                to the platform.
              </Form.Text>
              <Row className='me-0 ms-0 flex-nowrap'>
                <Form.Control
                  className='grow-1 w-auto'
                  placeholder='Access Key'
                  readOnly={true}
                  value={customerData?.accessKey || ''}
                />
                <CopyButton
                  dataSrc={() => customerData?.accessKey}
                  title='Copy Access Key'
                />
              </Row>
            </Form.Group>
            <Button
              id='revokeAccessKey'
              onClick={() => setAccessKeyWarning(true)}
              type='button'
              variant='danger'
            >
              <Spinner
                animation='border'
                as='span'
                className='d-none me-2'
                role='status'
                size='sm'
              />
              <MdOutlineDelete className='button-icon' />
              Revoke/Regenerate Access Key
            </Button>
            <Alert show={accessKeyWarning} variant='danger'>
              <Alert.Heading>Revoke/Regenerate Access Key</Alert.Heading>
              <p>
                Are you sure you want to revoke this key? Doing so is
                non-reversible.
              </p>
              <hr />
              <div className='d-flex justify-content-end'>
                <Button
                  onClick={() => setAccessKeyWarning(false)}
                  variant='outline-secondary'
                >
                  Cancel
                </Button>
                <Button
                  className='ms-2'
                  onClick={() => {
                    setAccessKeyWarning(false);
                    updateCustomer(document.getElementById('revokeAccessKey'), {
                      ...customerData,
                      accessKey: '',
                    });
                  }}
                  variant='outline-danger'
                >
                  Revoke Key
                </Button>
              </div>
            </Alert>
          </Form>
        </Card.Body>
      </Card>
      <ChangePassword />
      <Card className='m-5'>
        <Card.Header className='fw-bold'>Delete Account</Card.Header>
        <Card.Body>
          <Button
            id='deleteAccountButton'
            onClick={() => setDeleteAcctWarning(true)}
            type='button'
            variant='danger'
          >
            <TbUserCancel className='button-icon' />
            Delete Account
          </Button>
          <Alert show={deleteAcctWarning} variant='danger'>
            <Alert.Heading>Delete Account</Alert.Heading>
            <p>
              Are you sure you want to delete your account? Doing so is
              non-reversible.
            </p>
            <hr />
            <div className='d-flex justify-content-end'>
              <Button
                onClick={() => setDeleteAcctWarning(false)}
                variant='outline-secondary'
              >
                Cancel
              </Button>
              <Button
                className='ms-2'
                onClick={() => {
                  setDeleteAcctWarning(false);
                  deleteCustomer()
                    .then(() => {
                      signOut();
                      navigate('/');
                    })
                    .catch((e) => console.log(e));
                }}
                variant='outline-danger'
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
