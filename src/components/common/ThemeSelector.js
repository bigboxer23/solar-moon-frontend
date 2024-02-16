import Tippy from '@tippyjs/react';
import classNames from 'classnames';
import { LuMoon, LuSun } from 'react-icons/lu';
import { MdComputer } from 'react-icons/md';

import { useStickyState } from '../../utils/Utils';

export default function ThemeSelector() {
  const [activeTheme, setActiveTheme] = useStickyState(null, 'theme');

  function onThemeChange(theme) {
    setActiveTheme(theme);

    if (
      theme === 'dark' ||
      (theme === null &&
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
              [themeButtonActiveStyle]: activeTheme === null,
              [themeButtonInactiveStyle]: activeTheme !== null,
            })}
            onClick={() => {
              onThemeChange(null);
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
