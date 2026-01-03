import { Flex, Link, useAuthenticator, useTheme } from '@aws-amplify/ui-react';
import type { ReactElement } from 'react';

export function SignInFooter(): ReactElement {
  const { toForgotPassword } = useAuthenticator();
  const { tokens } = useTheme();

  return (
    <Flex justifyContent='center' padding={`${tokens.space.xs} 0 0 0`}>
      <Link onClick={toForgotPassword}>Reset your password</Link>
    </Flex>
  );
}
