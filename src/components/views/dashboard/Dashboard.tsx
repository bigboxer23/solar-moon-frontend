import type { Dispatch, ReactElement, SetStateAction } from 'react';
import { useEffect } from 'react';

import { useStickyState } from '../../../utils/Utils';
import Overview from './Overview';

interface DashboardProps {
  setTrialDate?: Dispatch<SetStateAction<Date | null>>;
}

export default function Dashboard({
  setTrialDate,
}: DashboardProps): ReactElement {
  const [unlocked] = useStickyState<string | null>(null, 'unlock.code');

  const maybeRedirect = (): boolean => {
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
    <main className='Home2 flex flex-col items-center'>
      <Overview setTrialDate={setTrialDate} />
    </main>
  );
}
