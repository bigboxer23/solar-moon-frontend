import { useTheme } from '@aws-amplify/ui-react';

import PageFooter from '../PageFooter';

export function Footer() {
  const { tokens } = useTheme();

  return (
    <div className='mt-8'>
      <PageFooter />
    </div>
  );
}
