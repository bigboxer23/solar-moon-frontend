import logo from '../../assets/logo.svg';

export default function HeaderBar({ headerText }) {
  return (
    <div className='Navbar border-text-secondary flex h-[4.5rem] w-full items-center border-b bg-brand-primary-light sm:h-[6.25rem] dark:border-0 dark:bg-gray-900'>
      <div className='flex items-center justify-center'>
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
