export default function Meter({ value, className = '' }) {
  return (
    <div className='Meter h-4 w-20 rounded-full border'>
      <div
        className='h-full rounded-full bg-brand-primary'
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
