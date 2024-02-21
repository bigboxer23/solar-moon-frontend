import { Link } from '@aws-amplify/ui-react';

import exampleDevice from '../../../assets/docs/exampleDevice.jpg';
import {
  DEVICE_HELP_TEXT1,
  DEVICE_HELP_TEXT2,
  DEVICE_HELP_TEXT3,
  DEVICE_HELP_TEXT4,
} from '../../../utils/HelpText';
import Button from '../../common/Button';
import Modal, { ModalFooter, ModalHeader } from '../../common/Modal';

export default function NewDeviceExampleDialog({
  show,
  setShow,
  showDeviceCreation,
}) {
  return (
    <Modal className='NewSiteDialog' isOpen={show} size='lg'>
      <ModalHeader
        label='Creating a Device'
        onCloseClick={() => setShow(false)}
      />
      <div className='flex flex-col-reverse items-center p-6 text-black dark:text-gray-100 sm:flex-row sm:items-start'>
        <div className='p-4 text-sm'>
          <p className='indent-2'>
            {DEVICE_HELP_TEXT1 + ' '}
            <Link
              className='text-brand-primary underline'
              href='https://solarmoonanalytics.com/docs/connectingDevice'
            >
              here
            </Link>
            {'. ' + DEVICE_HELP_TEXT2}
          </p>
          <br />
          <p className='indent-2'>{DEVICE_HELP_TEXT3}</p>
          <br />
          <p className='indent-2'>{DEVICE_HELP_TEXT4}</p>
        </div>
        <img
          className='max-w-[300px] rounded-xl object-fill sm:max-w-[400px]'
          src={exampleDevice}
        />
      </div>
      <ModalFooter className='space-x-2'>
        <Button
          onClick={() => {
            setShow(false);
            showDeviceCreation(true);
          }}
          type='submit'
          variant='primary'
        >
          Create first device
        </Button>
      </ModalFooter>
    </Modal>
  );
}
