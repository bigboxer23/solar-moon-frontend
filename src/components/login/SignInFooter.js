import { Flex, Link, useAuthenticator, useTheme } from '@aws-amplify/ui-react';

export function SignInFooter() {
  const { toForgotPassword } = useAuthenticator();
  const { tokens } = useTheme();

  return (
    <Flex justifyContent='center' padding={`${tokens.space.xs} 0 0 0`}>
      <Link onClick={toForgotPassword}>Reset your password</Link>
    </Flex>
  );
}
