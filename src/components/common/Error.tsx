import type { ReactElement } from 'react';

interface ErrorProps {
  className?: string;
}

export default function Error({ className = '' }: ErrorProps): ReactElement {
  const reloadPage = function () {
    window.location.href = '/';
  };

  return (
    <div className={`${className} Error my-8 flex justify-center`}>
      <p className='text-center text-gray-700 dark:text-gray-300'>
        We&apos;re sorry, there&apos;s some trouble loading your data at
        present.
        <br /> Please click{' '}
        <span>
          <button
            className='font-bold text-gray-400 underline'
            onClick={reloadPage}
          >
            here
          </button>
        </span>{' '}
        or refresh the page to try again.
      </p>
    </div>
  );
}
