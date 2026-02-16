import { useAuthenticator } from '@aws-amplify/ui-react';
import classNames from 'classnames';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { LuSun } from 'react-icons/lu';
import { MdOutlineInfo } from 'react-icons/md';
import { Location, NavLink, useLocation } from 'react-router-dom';
import { useOnClickOutside } from 'usehooks-ts';

// @ts-ignore - SVG import handled by webpack
import logo from '../../assets/logo.svg';
import { getDaysLeftInTrial } from '../../utils/Utils';
import ProfileMenu from './ProfileMenu';

interface NavbarProps {
  trialDate: number;
}

// TODO: break this up, it's a mess (break out the slider menu at least)
export default function Navbar({ trialDate }: NavbarProps): ReactElement {
  const separatorStyle =
    'text-gray-400 text-lg text-decoration-none font-bold hidden lg:block dark:text-brand-secondary';
  const linkStyle =
    'text-black dark:text-gray-100 dark:text-gray-100 font-bold text-lg text-decoration-none';
  const activeLinkStyle =
    'text-black dark:text-gray-100 dark:text-gray-100 font-bold text-lg border-b-2 border-text-primary text-decoration-none border-black dark:border-white';

  const slideMenuLinkStyle =
    'text-start text-black dark:text-gray-100 font-bold text-2xl text-decoration-none w-fit';
  const slideMenuActiveLinkStyle =
    'text-black dark:text-gray-100 font-bold text-2xl border-b-2 border-text-primary dark:border-gray-100 text-decoration-none border-black w-fit';

  const [slideMenuOpen, setSlideMenuOpen] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef as React.RefObject<HTMLElement>, () => {
    if (slideMenuOpen) {
      setSlideMenuOpen(false);
    }
  });

  const location = useLocation();

  useEffect(() => {
    setSlideMenuOpen(false);
  }, [location]);

  const { signOut } = useAuthenticator((context) => [context.user]);

  function getPageName(location: Location): string {
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
      <div className='Navbar2 flex h-[4.5rem] w-full items-center justify-between border-b border-gray-400 dark:border-b-0 sm:h-[6.25rem]'>
        <NavLink className='flex items-center justify-center' to='/'>
          <img
            alt='brand'
            className='ml-6 size-10 sm:ml-8 sm:size-12'
            src={logo}
          />
        </NavLink>
        <div className='flex items-center justify-center sm:hidden'>
          <span className='text-xl font-bold text-black dark:text-gray-100'>
            {getPageName(location)}
          </span>
        </div>
        <nav className='hidden items-center sm:flex sm:gap-x-6 md:gap-x-12 lg:gap-x-10'>
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
        <div className='mr-8 hidden items-center justify-center sm:flex'>
          <ProfileMenu trialDate={trialDate} />
        </div>
        <div className='mr-6 flex items-center justify-center text-black dark:text-gray-100 sm:hidden'>
          <FaBars className='text-2xl' onClick={() => setSlideMenuOpen(true)} />
        </div>
      </div>
      <div
        className={classNames(
          'Navbar2SlideMenu fixed top-0 right-0 h-screen w-3/4 bg-white dark:bg-gray-900 shadow-panel z-10 transition-all duration-300 ease-in-out pl-10 pt-6 pr-6',
          {
            'translate-x-0': slideMenuOpen,
            'translate-x-full': !slideMenuOpen,
          },
        )}
        ref={menuRef}
      >
        <div className='mb-4 flex w-full items-center justify-end'>
          <button
            aria-label='close menu'
            className='text-black dark:text-gray-100'
            onClick={() => setSlideMenuOpen(false)}
          >
            <FaXmark className='text-3xl' />
          </button>
        </div>
        <nav className='flex w-full flex-col gap-y-8'>
          {trialDate > 0 && (
            <div className='flex'>
              <MdOutlineInfo className='mr-2 text-gray-400' size={18} />
              <span className='mr-4 text-sm text-gray-400'>
                {getDaysLeftInTrial(trialDate)} in trial
              </span>
            </div>
          )}
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
            to='/manage'
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
