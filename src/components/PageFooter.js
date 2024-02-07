export default function PageFooter() {
  const year = new Date().getFullYear();
  return (
    <div className='Footer2 flex justify-center bg-brand-primary-light pb-6 dark:bg-gray-950'>
      <p className='text-sm text-gray-400'>
        Copyright © {year} Solar Moon Analytics, LLC
      </p>
    </div>
  );
}
