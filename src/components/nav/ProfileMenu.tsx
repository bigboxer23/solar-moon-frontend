import { fetchUserAttributes } from '@aws-amplify/auth';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { ReactElement, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { getDaysLeftInTrial } from '../../utils/Utils';
import Avatar from '../common/Avatar';
import ThemeSelector from '../common/ThemeSelector';

interface ProfileMenuProps {
  trialDate: number;
}

interface UserAttributes {
  name?: string;
}

export default function ProfileMenu({
  trialDate,
}: ProfileMenuProps): ReactElement {
  const [userAttributes, setUserAttributes] = useState<UserAttributes | null>(
    null,
  );

  const { signOut } = useAuthenticator((context) => [context.user]);
  const menuItemClassName =
    'flex items-center space-x-2 text-text-primary hover:bg-gray-200 dark:bg-gray-700 px-4 py-1 hover:dark:bg-gray-500 cursor-pointer';

  const menuItemNoHoverClassName =
    'flex items-center space-x-2 text-text-primary dark:bg-gray-700 px-4 py-1 cursor-pointer';

  useEffect(() => {
    fetchUserAttributes().then((attributes) =>
      setUserAttributes(attributes ?? null),
    );
  }, []);

  return (
    <div className='ProfileMenu flex items-center text-black dark:text-gray-100'>
      {trialDate > 0 && (
        <span className='mr-4 text-sm text-gray-400'>
          {getDaysLeftInTrial(trialDate)} in trial
        </span>
      )}
      <Menu
        boundingBoxPadding='12'
        gap={12}
        menuButton={
          <MenuButton>
            <Avatar attributes={userAttributes ?? undefined} />
          </MenuButton>
        }
        menuClassName='bg-white dark:bg-gray-700 shadow-panel rounded-md py-2 w-36'
      >
        <MenuItem className={menuItemNoHoverClassName} disabled>
          <ThemeSelector />
        </MenuItem>
        <MenuItem className={menuItemClassName}>
          <NavLink className='size-full' to='/profile'>
            Profile
          </NavLink>
        </MenuItem>
        <MenuItem className={menuItemClassName} onClick={signOut}>
          Sign out
        </MenuItem>
      </Menu>
    </div>
  );
}
