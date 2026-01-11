import type { ReactNode } from 'react';

// @ts-ignore - SVG import handled by webpack
import logo from '../../assets/logo.svg';

interface HeaderBarProps {
  headerText?: string;
  leftContent?: ReactNode;
}

export default function HeaderBar({ headerText, leftContent }: HeaderBarProps) {
  return (
    <div
      className='
    Navbar flex h-[4.5rem] w-full items-center border-b border-gray-400 dark:border-0 sm:h-[6.25rem]'
    >
      <div className='flex items-center justify-center'>
        {leftContent}
        <img
          alt='brand'
          className='ml-6 size-10 sm:ml-8 sm:size-12'
          src={logo}
        />
      </div>
      <div className='ms-4 flex items-center'>
        <span className='text-xl font-bold text-black dark:text-gray-100'>
          {headerText}
        </span>
      </div>
    </div>
  );
}
