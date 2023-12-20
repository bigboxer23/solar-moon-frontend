import { Form } from 'react-bootstrap';
import { MdKey } from 'react-icons/md';

import logo from '../../../../assets/logo.svg';
import {
  onEnterPressed,
  preventSubmit,
  useStickyState,
} from '../../../../utils/Utils';
import Button from '../../common/Button';

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
    <div className='LockPage flex max-w-full flex-col items-center'>
      <div className='Navbar2 flex h-[4.5rem] w-full items-center border-b border-text-secondary bg-brand-primary-light sm:h-[6.25rem]'>
        <div className='flex items-center justify-center'>
          <img
            alt='brand'
            className='ml-6 h-10 w-10 sm:ml-8 sm:h-12 sm:w-12'
            src={logo}
          />
        </div>
        <div className='ms-4 flex items-center'>
          <span className='text-xl font-bold'>
            Enter the access code to proceed to the site
          </span>
        </div>
      </div>
      <div className='fade-in my-8 flex w-[30rem] max-w-full content-center bg-white p-6 shadow-panel sm:rounded-lg sm:p-8'>
        <div className='flex w-full flex-col'>
          <div className='mb-3'>
            <div>Access Code</div>
            <Form.Control //TODO:Remove this w/real form library
              id='accessKey'
              onKeyPress={preventSubmit}
              onKeyUp={(event) => onEnterPressed(event, applyAccessKey)}
              placeholder='Enter Access Code'
              type='password'
            />
          </div>
          <Button
            className='mt-3 justify-center'
            onClick={applyAccessKey}
            type='button'
            variant='primary'
          >
            <MdKey className='button-icon' />
            Submit Access Code
          </Button>
        </div>
      </div>
    </div>
  );
};
