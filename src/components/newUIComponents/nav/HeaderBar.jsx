import logo from '../../../assets/logo.svg';

export default function HeaderBar({ headerText }) {
  return (
    <div className='Navbar2 flex h-[4.5rem] w-full items-center border-b border-text-secondary bg-brand-primary-light sm:h-[6.25rem]'>
      <div className='flex items-center justify-center'>
        <img
          alt='brand'
          className='ml-6 h-10 w-10 sm:ml-8 sm:h-12 sm:w-12'
          src={logo}
        />
      </div>
      <div className='ms-4 flex items-center'>
        <span className='text-xl font-bold'>{headerText}</span>
      </div>
    </div>
  );
}
