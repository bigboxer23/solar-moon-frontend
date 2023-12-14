import { Button, Card, CardBody, CardHeader, Form } from 'react-bootstrap';
import { MdKey } from 'react-icons/md';
import {
  onEnterPressed,
  preventSubmit,
  useStickyState,
} from '../../utils/Utils';

export const LockPage = () => {
  const [_, setUnlocked] = useStickyState(null, 'unlock.code');

  const applyAccessKey = () => {
    const value = document.getElementById('accessKey').value;
    if (process.env.REACT_APP_ACCESS_CODE === value) {
      setUnlocked(value);
      window.location.href = '/';
    }
  };
  return (
    <div className='min-vh-95 d-flex justify-content-center container pt-5'>
      <Card className='min-width-750 max-height-250'>
        <CardHeader className='fw-bold'>
          Enter the access code to proceed to the site
        </CardHeader>
        <CardBody>
          <Form className='h-100 d-flex flex-column'>
            <Form.Group className='mb-3'>
              <Form.Label>Access Code</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter Access Code'
                id='accessKey'
                onKeyPress={preventSubmit}
                onKeyUp={(event) => onEnterPressed(event, applyAccessKey)}
              />
            </Form.Group>
            <div className='grow-1' />
            <Button type='button' onClick={applyAccessKey} variant='primary'>
              <MdKey className='button-icon' />
              Submit Access Key
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};
