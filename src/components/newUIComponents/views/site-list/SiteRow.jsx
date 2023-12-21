import { NavLink } from 'react-router-dom';

export default function SiteRow({ site }) {
  return (
    <NavLink
      className='flex rounded p-4 hover:bg-neutral-100'
      to={`/sites/${site.id}`}
    >
      <div className='flex flex-col justify-center'>
        <div className='text-base font-bold'>{site.deviceName}</div>
        <div className='text-xs text-neutral-500'>
          {site.city}, {site.country}
        </div>
      </div>
    </NavLink>
  );
}
