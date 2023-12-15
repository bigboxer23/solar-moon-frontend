import { LuSun } from 'react-icons/lu';
import { NavLink } from 'react-router-dom';

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
          <img alt='brand' className='ml-8 h-12 w-12' src={logo} />
        </div>
        <nav className='space-x-10'>
          <NavLink
            className={({ isActive }) =>
              isActive ? activeLinkStyle : linkStyle
            }
            to='/'
          >
            Dashboard
          </NavLink>
          <LuSun className={separatorStyle} />
          <NavLink
            className={({ isActive }) =>
              isActive ? activeLinkStyle : linkStyle
            }
            to='/sites'
          >
            Sites
          </NavLink>
          <LuSun className={separatorStyle} />
          <NavLink
            className={({ isActive }) =>
              isActive ? activeLinkStyle : linkStyle
            }
            to='/reports'
          >
            Reports
          </NavLink>
          <LuSun className={separatorStyle} />
          <NavLink
            className={({ isActive }) =>
              isActive ? activeLinkStyle : linkStyle
            }
            to='/alerts'
          >
            Alerts
          </NavLink>
          <LuSun className={separatorStyle} />
          <NavLink
            className={({ isActive }) =>
              isActive ? activeLinkStyle : linkStyle
            }
            to='/manage'
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
