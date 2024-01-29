import { useEffect, useState } from 'react';

import { getAlarmData, getSitesOverview } from '../../../services/services';
import { sortDevices } from '../../../utils/Utils';
import Loader from '../../common/Loader';
import SiteRow from './SiteRow';

export default function SiteList() {
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    getSitesOverview()
      .then(({ data }) => {
        setLoading(false);
        const sites = data.devices
          .filter((d) => d.isSite)
          .map((site) => {
            site.deviceCount = 0;
            site.siteData = data.sites[site.id];
            return site;
          })
          .sort(sortDevices);

        data.devices
          .filter((d) => !d.isSite)
          .forEach((d) => {
            const site = sites.find((s) => s.name === d.site);
            if (site) {
              site.deviceCount = site.deviceCount + 1 || 1;
            }
          });

        getAlarmData().then(({ data }) => {
          const activeAlerts = data.filter((d) => d.state !== 0);
          sites.forEach((site) => {
            site.activeAlertCount = activeAlerts.filter(
              (alert) => alert.deviceSite === site.name,
            ).length;
          });
          setSites(sites);
        });
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
    <main className='SiteList flex flex-col items-center bg-brand-primary-light dark:bg-neutral-900'>
      <div className='fade-in my-8 w-[55rem] max-w-full space-y-4 rounded-lg bg-white p-6 shadow-panel sm:p-8 dark:bg-neutral-700'>
        <div className='text-base font-bold text-black dark:text-neutral-100'>
          Sites
        </div>
        <div className='flex flex-col justify-center space-y-4 sm:space-y-2'>
          {sites.map((site) => (
            <SiteRow key={site.id} site={site} />
          ))}
        </div>
      </div>
    </main>
  );
}
