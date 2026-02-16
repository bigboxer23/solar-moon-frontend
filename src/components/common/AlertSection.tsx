import type { ReactElement } from 'react';

import Button from './Button';

interface AlertSectionProps {
  title: string;
  buttonTitle: string;
  show: boolean;
  setShow: (show: boolean) => void;
  onClick: () => void;
}

export default function AlertSection({
  title,
  buttonTitle,
  show,
  setShow,
  onClick,
}: AlertSectionProps): ReactElement | null {
  if (!show) {
    return null;
  }

  return (
    <div className='border-danger mt-8 rounded-lg border-2 p-4'>
      <div className='text-danger mb-2 flex w-full justify-between'>
        <span className='text-lg font-bold text-black dark:text-gray-100'>
          {title}
        </span>
      </div>
      <div className='mt-8 flex content-end'>
        <Button
          className='ml-auto'
          onClick={() => setShow(false)}
          variant='secondary'
        >
          Cancel
        </Button>
        <Button
          className='ms-2'
          onClick={() => {
            setShow(false);
            onClick();
          }}
          variant='danger'
        >
          {buttonTitle}
        </Button>
      </div>
    </div>
  );
}
