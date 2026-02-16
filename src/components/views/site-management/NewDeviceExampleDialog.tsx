import type { ReactElement } from 'react';
import { FiExternalLink } from 'react-icons/fi';

// @ts-ignore - JPG import handled by webpack
import exampleDevice from '../../../assets/docs/exampleDevice.jpg';
import {
  DEVICE_HELP_TEXT1,
  DEVICE_HELP_TEXT2,
  DEVICE_HELP_TEXT3,
  DEVICE_HELP_TEXT4,
} from '../../../utils/HelpText';
import Button from '../../common/Button';
import Modal, { ModalFooter, ModalHeader } from '../../common/Modal';

interface NewDeviceExampleDialogProps {
  show: boolean;
  setShow: (show: boolean) => void;
  showDeviceCreation: (show: boolean) => void;
}

export default function NewDeviceExampleDialog({
  show,
  setShow,
  showDeviceCreation,
}: NewDeviceExampleDialogProps): ReactElement {
  return (
    <Modal isOpen={show} size='lg'>
      <ModalHeader
        label='Creating a Device'
        onCloseClick={() => setShow(false)}
      />
      <div className='flex flex-col-reverse items-center p-6 text-black dark:text-gray-100 sm:flex-row sm:items-start'>
        <div className='p-4 text-sm'>
          <p className='indent-2'>
            {`${DEVICE_HELP_TEXT1} `}
            <span className='inline-block'>
              <span
                className='flex cursor-pointer items-center pl-0.5 text-brand-primary underline'
                onClick={() =>
                  window.open(
                    'https://solarmoonanalytics.com/docs/connectingDevice',
                  )
                }
              >
                <FiExternalLink className='-mr-2' />
                here
              </span>
            </span>
            {`. ${DEVICE_HELP_TEXT2}`}
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
      <ModalFooter className='gap-x-2'>
        <Button
          onClick={() => {
            setShow(false);
            showDeviceCreation(true);
          }}
          variant='primary'
        >
          Create first device
        </Button>
      </ModalFooter>
    </Modal>
  );
}
