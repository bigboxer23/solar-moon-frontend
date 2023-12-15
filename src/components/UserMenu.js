import { useAuthenticator } from '@aws-amplify/ui-react';
import Avatar from 'react-avatar';
import { NavDropdown } from 'react-bootstrap';
import { AiOutlineUser } from 'react-icons/ai';
import { MdLogin } from 'react-icons/md';
import { Link } from 'react-router-dom';

const UserMenu = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  return (
    <NavDropdown
      className='userProfile profile gap-3'
      title={
        <Avatar
          name={user.attributes.name}
          round={true}
          size={48}
          textSizeRatio={2}
        />
      }
    >
      <div className='d-flex pb-1 pe-2 ps-2'>
        <Avatar
          name={user.attributes.name}
          round={true}
          size={40}
          textSizeRatio={2}
        />
        <div className='ms-3'>
          <div className='fw-bolder smaller-text'>{user.attributes.email}</div>
          <div className='text-body-secondary smaller-text'>
            {user.attributes.name}
          </div>
        </div>
      </div>
      <NavDropdown.Divider />
      <NavDropdown.Item as={Link} to='userManagement'>
        <AiOutlineUser className='sub-menu-icon' />
        Profile
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item as={Link} onClick={() => signOut()} to='/'>
        <MdLogin className='sub-menu-icon' /> Sign Out
      </NavDropdown.Item>
    </NavDropdown>
  );
};
export default UserMenu;
