import { Input } from '../../common/Input';

export default function CustomerInformation({ email, name }) {
  return (
    <div className='fade-in my-8 w-[55rem] max-w-full rounded-lg bg-white p-6 shadow-panel sm:p-8'>
      <div className='mb-10 flex w-full justify-between'>
        <span className='text-lg font-bold'>Customer Information</span>
      </div>
      <form>
        <Input
          inputProps={{ readOnly: true, value: email }}
          label='Email Address'
          type='text'
          variant='underline'
          wrapperClassName='mb-4'
        />

        <Input
          inputProps={{ readOnly: true, value: name }}
          label='Name'
          type='text'
          variant='underline'
        />
      </form>
    </div>
  );
}
