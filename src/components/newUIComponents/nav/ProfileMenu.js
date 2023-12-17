import { useAuthenticator } from '@aws-amplify/ui-react';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { NavLink } from 'react-router-dom';

import Avatar from '../common/Avatar';

export default function ProfileMenu() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const menuItemClassName =
    'flex items-center space-x-2 text-text-primary hover:bg-neutral-200 px-4 py-1 cursor-pointer';

  return (
    <div className='ProfileMenu'>
      <Menu
        boundingBoxPadding='12'
        gap={12}
        menuButton={
          <MenuButton>
            <Avatar user={user} />
          </MenuButton>
        }
        menuClassName='bg-white shadow-panel rounded-md py-2 w-36'
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
