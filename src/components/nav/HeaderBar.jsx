import logo from '../../assets/logo.svg';

export default function HeaderBar({ headerText }) {
  return (
    <div className='Navbar flex h-[4.5rem] w-full items-center border-b border-text-secondary bg-brand-primary-light sm:h-[6.25rem] dark:bg-neutral-900'>
      <div className='flex items-center justify-center'>
        <img
          alt='brand'
          className='ml-6 size-10 sm:ml-8 sm:size-12'
          src={logo}
        />
      </div>
      <div className='ms-4 flex items-center'>
        <span className='text-xl font-bold'>{headerText}</span>
      </div>
    </div>
  );
}
