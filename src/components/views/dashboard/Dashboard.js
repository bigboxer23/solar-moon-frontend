import { useEffect } from 'react';

import { useStickyState } from '../../../utils/Utils';
import Overview from './Overview';

export default function Dashboard() {
  const [unlocked, _] = useStickyState(null, 'unlock.code');

  const maybeRedirect = () => {
    if (
      process.env.REACT_APP_ACCESS_CODE &&
      process.env.REACT_APP_ACCESS_CODE !== unlocked
    ) {
      window.location.href = '/lock';
      return true;
    }
    return false;
  };

  useEffect(() => {
    maybeRedirect();
  }, []);
  return (
    <main className='Home2 flex flex-col items-center bg-brand-primary-light dark:bg-gray-900'>
      <Overview />
    </main>
  );
}
