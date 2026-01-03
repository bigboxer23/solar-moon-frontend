import { ReactElement } from 'react';

export default function PageFooter(): ReactElement {
  const year = new Date().getFullYear();
  return (
    <div className='Footer2 flex justify-center pb-6'>
      <p className='text-sm text-gray-400'>
        Copyright © {year} Solar Moon Analytics, LLC
      </p>
    </div>
  );
}
