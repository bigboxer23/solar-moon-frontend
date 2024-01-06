import { Flex, Text, useTheme } from '@aws-amplify/ui-react';

export function Footer() {
  const { tokens } = useTheme();

  return (
    <Flex justifyContent='center' padding={tokens.space.medium}>
      <Text>Copyright © 2023 Solar Moon Analytics, LLC</Text>
    </Flex>
  );
}
