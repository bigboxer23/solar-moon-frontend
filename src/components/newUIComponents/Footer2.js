export default function Footer2() {
  const year = new Date().getFullYear();
  return (
    <div className='Footer2 flex justify-center bg-brand-primary-light'>
      <p className='text-sm text-text-secondary'>
        Copyright © {year} Solar Moon Analytics, LLC
      </p>
    </div>
  );
}
