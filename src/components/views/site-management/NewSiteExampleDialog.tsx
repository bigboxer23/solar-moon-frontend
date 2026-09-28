import type { ReactElement } from 'react';

// @ts-ignore - JPG import handled by webpack
import exampleSite from '../../../assets/docs/exampleSite.jpg';
import {
  SITE_HELP_TEXT1,
  SITE_HELP_TEXT2,
  SITE_HELP_TEXT3,
} from '../../../utils/HelpText';
import Button from '../../common/Button';
import Modal, { ModalFooter, ModalHeader } from '../../common/Modal';

interface NewSiteExampleDialogProps {
  show: boolean;
  setShow: (show: boolean) => void;
  showSiteCreation: (show: boolean) => void;
}

export default function NewSiteExampleDialog({
  show,
  setShow,
  showSiteCreation,
}: NewSiteExampleDialogProps): ReactElement {
  return (
    <Modal isOpen={show} size='lg'>
      <ModalHeader
        label='Creating a Site'
        onCloseClick={() => setShow(false)}
      />
      <div className='flex flex-col-reverse items-center p-6 text-black sm:flex-row sm:items-start dark:text-gray-100'>
        <div className='p-4 text-sm'>
          <p className='indent-2'>{SITE_HELP_TEXT1}</p>
          <br />
          <p className='indent-2'>{SITE_HELP_TEXT2}</p>
          <br />
          <p className='indent-2'>{SITE_HELP_TEXT3}</p>
        </div>
        <img
          className='max-w-75 rounded-xl object-fill sm:max-w-100'
          src={exampleSite}
        />
      </div>
      <ModalFooter className='gap-x-2'>
        <Button
          onClick={() => {
            setShow(false);
            showSiteCreation(true);
          }}
          variant='primary'
        >
          Create first site
        </Button>
      </ModalFooter>
    </Modal>
  );
}
