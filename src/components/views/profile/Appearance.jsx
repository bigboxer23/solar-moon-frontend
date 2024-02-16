import ThemeSelector from '../../common/ThemeSelector';

export default function Appearance() {
  return (
    <div className='fade-in my-8 flex w-[40rem] max-w-full flex-col bg-white p-6 shadow-panel dark:bg-gray-800 sm:hidden sm:rounded-lg sm:p-8'>
      <div className='mb-8 flex w-full justify-between'>
        <span className='text-lg font-bold text-black dark:text-gray-100'>
          Appearance
        </span>
      </div>
      <ThemeSelector extended={true} />
    </div>
  );
}
