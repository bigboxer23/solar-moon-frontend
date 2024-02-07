import { useAuthenticator } from '@aws-amplify/ui-react';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { NavLink } from 'react-router-dom';

import Avatar from '../common/Avatar';

export default function ProfileMenu() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const menuItemClassName =
    'flex items-center space-x-2 text-text-primary hover:bg-neutral-200 dark:bg-neutral-600 px-4 py-1 hover:dark:bg-neutral-500 cursor-pointer';

  return (
    <div className='ProfileMenu text-black dark:text-neutral-100'>
      <Menu
        boundingBoxPadding='12'
        gap={12}
        menuButton={
          <MenuButton>
            <Avatar user={user} />
          </MenuButton>
        }
        menuClassName='bg-white dark:bg-neutral-600 shadow-panel rounded-md py-2 w-36'
      >
        <MenuItem className={menuItemClassName}>
          <NavLink to='/profile'>Profile</NavLink>
        </MenuItem>
        <MenuItem className={menuItemClassName} onClick={signOut}>
          Sign out
        </MenuItem>
      </Menu>
    </div>
  );
}
