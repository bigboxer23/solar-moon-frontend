export default function PageFooter() {
  const year = new Date().getFullYear();
  return (
    <div className='Footer2 flex justify-center bg-brand-primary-light dark:bg-neutral-900'>
      <p className='text-sm text-text-secondary'>
        Copyright © {year} Solar Moon Analytics, LLC
      </p>
    </div>
  );
}
