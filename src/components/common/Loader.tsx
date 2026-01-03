import type { ReactElement } from 'react';

interface LoaderProps {
  className?: string;
}

export default function Loader({ className = '' }: LoaderProps): ReactElement {
  return (
    <div className={`${className} Loader`}>
      <div className='loader-ellipsis'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
