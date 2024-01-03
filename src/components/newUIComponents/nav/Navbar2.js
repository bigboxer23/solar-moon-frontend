import { useAuthenticator } from '@aws-amplify/ui-react';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { LuSun } from 'react-icons/lu';
import { NavLink, useLocation } from 'react-router-dom';
import { useOnClickOutside } from 'usehooks-ts';

import logo from '../../../assets/logo.svg';
import ProfileMenu from './ProfileMenu';

// TODO: break this up, it's a mess (break out the slider menu at least)
export default function Navbar2() {
  const separatorStyle =
    'text-text-secondary text-lg text-decoration-none font-bold hidden lg:block';
  const linkStyle = 'text-black font-bold text-lg text-decoration-none';
  const activeLinkStyle =
    'text-black font-bold text-lg border-b-2 border-text-primary text-decoration-none border-black';

  const slideMenuLinkStyle =
    'text-start text-black font-bold text-2xl text-decoration-none w-fit';
  const slideMenuActiveLinkStyle =
    'text-black font-bold text-2xl border-b-2 border-text-primary text-decoration-none border-black w-fit';

  const [slideMenuOpen, setSlideMenuOpen] = useState(false);

  const menuRef = useRef(null);

  useOnClickOutside(menuRef, () => {
    if (slideMenuOpen) {
      setSlideMenuOpen(false);
    }
  });

  const location = useLocation();

  useEffect(() => {
    setSlideMenuOpen(false);
  }, [location]);

  const { user, signOut } = useAuthenticator((context) => [context.user]);

  function getPageName(location) {
    const path = location.pathname;
    const pathArray = path.split('/');

    switch (pathArray[1]) {
      case '':
        return 'Dashboard';
      case 'sites':
        return 'Sites';
      case 'reports':
        return 'Reports';
      case 'alerts':
        return 'Alerts';
      case 'manage':
        return 'Manage';
      default:
        return '';
    }
  }

  return (
    <>
      <div className='Navbar2 flex h-[4.5rem] w-full items-center justify-between border-b border-text-secondary bg-brand-primary-light sm:h-[6.25rem]'>
        <NavLink className='flex items-center justify-center' to='/'>
          <img
            alt='brand'
            className='ml-6 h-10 w-10 sm:ml-8 sm:h-12 sm:w-12'
            src={logo}
          />
        </NavLink>
        <div className='flex items-center justify-center sm:hidden'>
          <span className='text-xl font-bold text-black'>
            {getPageName(location)}
          </span>
        </div>
        <nav className='hidden items-center sm:flex sm:space-x-6 md:space-x-12 lg:space-x-10'>
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
            to='/siteManagement'
          >
            Manage
          </NavLink>
        </nav>
        {/* annoying hack because this thing has bizarre positioning */}
        <div className='mr-8 hidden items-center justify-center sm:flex'>
          <ProfileMenu />
        </div>
        <div className='mr-6 flex items-center justify-center sm:hidden'>
          <FaBars className='text-2xl' onClick={() => setSlideMenuOpen(true)} />
        </div>
      </div>
      <div
        className={classNames(
          'Navbar2SlideMenu fixed top-0 right-0 h-screen w-3/4 bg-white shadow-panel z-10 transition-all duration-300 ease-in-out pl-10 pt-6 pr-6',
          {
            'translate-x-0': slideMenuOpen,
            'translate-x-full': !slideMenuOpen,
          },
        )}
        ref={menuRef}
      >
        <div className='mb-4 flex w-full items-center justify-end'>
          <button onClick={() => setSlideMenuOpen(false)}>
            <FaXmark className='text-3xl' />
          </button>
        </div>
        <nav className='flex w-full flex-col space-y-8'>
          <NavLink
            className={({ isActive }) =>
              isActive ? slideMenuActiveLinkStyle : slideMenuLinkStyle
            }
            to='/'
          >
            Dashboard
          </NavLink>
          <LuSun className={separatorStyle} />
          <NavLink
            className={({ isActive }) =>
              isActive ? slideMenuActiveLinkStyle : slideMenuLinkStyle
            }
            to='/sites'
          >
            Sites
          </NavLink>
          <LuSun className={separatorStyle} />
          <NavLink
            className={({ isActive }) =>
              isActive ? slideMenuActiveLinkStyle : slideMenuLinkStyle
            }
            to='/reports'
          >
            Reports
          </NavLink>
          <LuSun className={separatorStyle} />
          <NavLink
            className={({ isActive }) =>
              isActive ? slideMenuActiveLinkStyle : slideMenuLinkStyle
            }
            to='/alerts'
          >
            Alerts
          </NavLink>
          <LuSun className={separatorStyle} />
          <NavLink
            className={({ isActive }) =>
              isActive ? slideMenuActiveLinkStyle : slideMenuLinkStyle
            }
            to='/siteManagement'
          >
            Manage
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? slideMenuActiveLinkStyle : slideMenuLinkStyle
            }
            to='/profile'
          >
            Profile
          </NavLink>
          <button className={slideMenuLinkStyle} onClick={signOut}>
            Sign Out
          </button>
        </nav>
      </div>
    </>
  );
}
