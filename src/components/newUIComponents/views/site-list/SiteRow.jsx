import { FaChevronRight } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

import { StatBlock } from '../dashboard/Overview';

export default function SiteRow({ site }) {
  return (
    <NavLink
      className='group flex items-center rounded p-4 transition-all duration-150 hover:bg-neutral-100'
      to={`/sites/${site.id}`}
    >
      <div className='flex flex-col justify-center'>
        <div className='text-base font-bold'>{site.deviceName}</div>
        <div className='text-xs text-neutral-500'>
          {site.city}, {site.country}
        </div>
      </div>

      {/*<StatBlock className='ml-8' title='devices' value={site.deviceCount} />*/}
      <div className='ml-auto items-center justify-center'>
        <FaChevronRight
          className='text-neutral-300 transition-all duration-150 group-hover:text-neutral-600'
          size={20}
        />
      </div>
    </NavLink>
  );
}
