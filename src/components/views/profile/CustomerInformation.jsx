import { Input } from '../../common/Input';

export default function CustomerInformation({ email, name }) {
  return (
    <div className='fade-in my-8 w-[40rem] max-w-full bg-white p-6 shadow-panel dark:bg-gray-800 sm:rounded-lg sm:p-8'>
      <div className='mb-8 flex w-full justify-between'>
        <span className='text-lg font-bold text-black dark:text-gray-100'>
          Customer Information
        </span>
      </div>
      <form>
        <Input
          className='mb-6'
          inputProps={{ readOnly: true, value: email }}
          label='Email Address'
          type='text'
          variant='underline'
        />

        <Input
          className='mb-4'
          inputProps={{ readOnly: true, value: name }}
          label='Name'
          type='text'
          variant='underline'
        />
      </form>
    </div>
  );
}
