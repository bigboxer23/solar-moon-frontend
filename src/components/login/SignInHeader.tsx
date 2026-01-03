import { Heading, useTheme } from '@aws-amplify/ui-react';
import type { ReactElement } from 'react';

export function SignInHeader(): ReactElement {
  const { tokens } = useTheme();

  return (
    <Heading level={3} padding={`${tokens.space.xl} ${tokens.space.xl} 0`}>
      Sign in to your Account
    </Heading>
  );
}
