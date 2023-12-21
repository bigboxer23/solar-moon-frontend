import { useEffect, useState } from 'react';

import { getDevices } from '../../../../services/services';
import Loader from '../../common/Loader';
import SiteRow from './SiteRow';

export default function SiteList() {
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    getDevices()
      .then(({ data }) => {
        setLoading(false);
        const sites = data.filter((d) => d.virtual);
        setSites(sites);
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
    <main className='SiteList flex flex-col items-center bg-brand-primary-light'>
      <div className='fade-in my-8 w-[55rem] max-w-full space-y-4 rounded-lg bg-white p-6 shadow-panel sm:p-8'>
        <div className='text-base font-bold'>Sites</div>
        <div className='flex flex-col justify-center space-y-4'>
          {sites.map((site) => (
            <SiteRow key={site.id} site={site} />
          ))}
        </div>
      </div>
    </main>
  );
}