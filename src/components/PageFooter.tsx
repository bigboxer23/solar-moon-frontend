import { ReactElement } from 'react';

import { formatBuildDetail, getBuildInfo } from '../utils/BuildInfo';

export default function PageFooter(): ReactElement {
  const year = new Date().getFullYear();
  const buildInfo = getBuildInfo();
  return (
    <div className='Footer2 flex justify-center pb-6'>
      <p className='text-sm text-gray-400'>
        Copyright © {year} Solar Moon Analytics, LLC{' '}
        <span title={formatBuildDetail(buildInfo)}>
          &middot; {buildInfo.version}
        </span>
      </p>
    </div>
  );
}
