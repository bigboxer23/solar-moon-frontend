import { useAuthenticator } from '@aws-amplify/ui-react';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { NavLink } from 'react-router-dom';

import Avatar from '../common/Avatar';
import ThemeSelector from '../common/ThemeSelector';

export default function ProfileMenu() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const menuItemClassName =
    'flex items-center space-x-2 text-text-primary hover:bg-gray-200 dark:bg-gray-700 px-4 py-1 hover:dark:bg-gray-500 cursor-pointer';

  const menuItemNoHoverClassName =
    'flex items-center space-x-2 text-text-primary dark:bg-gray-700 px-4 py-1 cursor-pointer';

  return (
    <div className='ProfileMenu text-black dark:text-gray-100'>
      <Menu
        boundingBoxPadding='12'
        gap={12}
        menuButton={
          <MenuButton>
            <Avatar user={user} />
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
