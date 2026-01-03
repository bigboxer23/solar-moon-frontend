import { Flex, Image, useTheme } from '@aws-amplify/ui-react';
import type { ReactElement } from 'react';

// @ts-ignore - SVG import handled by webpack
import logo from '../../assets/logo.svg';

export function Header(): ReactElement {
  const { tokens } = useTheme();

  return (
    <Flex justifyContent='center'>
      <Image
        alt='logo'
        padding={tokens.space.xl}
        src={logo}
        style={{ width: 200 }}
      />
    </Flex>
  );
}
