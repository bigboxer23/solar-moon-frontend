import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { NavLink, redirect, useMatch } from 'react-router-dom';

import { getDevice } from '../../../../services/services';
import Loader from '../../common/Loader';

export default function SiteDetails() {
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState({});
  const match = useMatch('/sites/:siteId');
  const siteId = match?.params?.siteId;

  if (!siteId) {
    return redirect('/sites');
  }

  useEffect(() => {
    getDevice(siteId)
      .then(({ data }) => {
        setSite(data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className='flex w-full items-center justify-center p-6'>
        <Loader />
      </div>
    );

  return (
    <main className='SiteDetails flex flex-col items-center bg-brand-primary-light'>
      <div className='fade-in my-8 w-[55rem] max-w-full rounded-lg bg-white p-6 shadow-panel sm:p-8'>
        <NavLink
          className='mb-4 flex items-center text-xs text-neutral-500 hover:underline'
          to='/sites'
        >
          <FaArrowLeft className='mr-2 inline-block' size='12' />
          <span>Back to all sites</span>
        </NavLink>
        <div className='text-lg font-bold'>{site.deviceName}</div>
      </div>
    </main>
  );
}
