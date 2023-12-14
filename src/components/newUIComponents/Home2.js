import Overview from './overview/Overview';
import SummaryHeader from './SummaryHeader';

export default function Home2() {
  return (
    <main className='Home2 flex flex-col items-center bg-brand-primary-light'>
      <SummaryHeader />
      <Overview />
    </main>
  );
}
