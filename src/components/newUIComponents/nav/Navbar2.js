import { NavLink } from 'react-router-dom';
import { LuSun } from 'react-icons/lu';
import logo from '../../../assets/logo.svg';
import UserMenu from '../../UserMenu';

export default function Navbar2() {
  const separatorStyle =
    'text-text-secondary text-lg text-decoration-none font-bold';
  const linkStyle = 'text-black font-bold text-lg text-decoration-none';
  const activeLinkStyle =
    'text-black font-bold text-lg decoration-2 underline-offset-4';

  return (
    <>
      <div className='Navbar2 flex h-[6.25rem] w-full items-center justify-between border-b border-text-secondary bg-brand-primary-light'>
        <div className='flex items-center justify-center'>
          <img src={logo} className='ml-8 h-12 w-12' alt='brand' />
        </div>
        <nav className='space-x-10'>
          <NavLink
            to='/'
            className={({ isActive }) =>
              isActive ? activeLinkStyle : linkStyle
            }
          >
            Dashboard
          </NavLink>
          <LuSun className={separatorStyle} />
          <NavLink
            to='/sites'
            className={({ isActive }) =>
              isActive ? activeLinkStyle : linkStyle
            }
          >
            Sites
          </NavLink>
          <LuSun className={separatorStyle} />
          <NavLink
            to='/reports'
            className={({ isActive }) =>
              isActive ? activeLinkStyle : linkStyle
            }
          >
            Reports
          </NavLink>
          <LuSun className={separatorStyle} />
          <NavLink
            to='/alerts'
            className={({ isActive }) =>
              isActive ? activeLinkStyle : linkStyle
            }
          >
            Alerts
          </NavLink>
          <LuSun className={separatorStyle} />
          <NavLink
            to='/manage'
            className={({ isActive }) =>
              isActive ? activeLinkStyle : linkStyle
            }
          >
            Manage
          </NavLink>
        </nav>
        {/* annoying hack because this thing has bizarre positioning */}
        <div className='mb-4 mr-8 flex items-center justify-center'>
          <UserMenu />
        </div>
      </div>
      {/* hack because tailwind border-bottom isn't workign with current install */}
      <div className='flex w-full justify-center px-6'>
        <hr className='m-0 flex w-full justify-center' />
      </div>
    </>
  );
}
