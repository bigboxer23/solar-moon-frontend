import Tippy from '@tippyjs/react';
import classNames from 'classnames';
import { useState } from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';
import { MdComputer } from 'react-icons/md';

export default function ThemeSelector() {
  const [activeTheme, setActiveTheme] = useState(localStorage.theme || '');

  function onThemeChange(theme) {
    setActiveTheme(theme);

    if (theme === '') {
      localStorage.removeItem('theme');
    } else {
      localStorage.theme = theme;
    }

    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  const themeButtonStyle =
    'flex-1 flex justify-center items-center py-1.5 transition-colors duration-300 ease-in-out';
  const themeButtonActiveStyle =
    'bg-gray-500 text-gray-100 dark:bg-gray-100 dark:text-gray-900';
  const themeButtonInactiveStyle =
    'hover:bg-gray-300 dark:hover:bg-gray-300 dark:hover:text-gray-900';

  return (
    <div className='ThemeSelector w-full'>
      <div className='my-2 flex w-full rounded border border-neutral-500 dark:border-neutral-100'>
        <Tippy
          className='dark:bg-neutral-500'
          content='System theme'
          delay={500}
          placement='top'
        >
          <button
            className={classNames(themeButtonStyle, {
              [themeButtonActiveStyle]: activeTheme === '',
              [themeButtonInactiveStyle]: activeTheme !== '',
            })}
            onClick={() => {
              onThemeChange('');
            }}
          >
            <MdComputer />
          </button>
        </Tippy>
        <Tippy
          className='dark:bg-neutral-500'
          content='Light theme'
          delay={500}
          placement='top'
        >
          <button
            className={classNames(themeButtonStyle, {
              [themeButtonActiveStyle]: activeTheme === 'light',
              [themeButtonInactiveStyle]: activeTheme !== 'light',
            })}
            onClick={() => {
              onThemeChange('light');
            }}
          >
            <LuSun />
          </button>
        </Tippy>
        <Tippy
          className='dark:bg-neutral-500'
          content='Dark theme'
          delay={500}
          placement='top'
        >
          <button
            className={classNames(themeButtonStyle, {
              [themeButtonActiveStyle]: activeTheme === 'dark',
              [themeButtonInactiveStyle]: activeTheme !== 'dark',
            })}
            onClick={() => {
              onThemeChange('dark');
            }}
          >
            <LuMoon />
          </button>
        </Tippy>
      </div>
    </div>
  );
}
