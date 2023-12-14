export default function SummaryHeader() {
  // TODO: Use real data here

  const dailyOutput = 36;
  const dailyProjectedPercentage = 95;
  return (
    <span className='SummaryHeader py-8 text-xl font-bold'>
      You have generated
      <span className='mx-1.5 text-3xl font-bold text-brand-primary'>
        {dailyOutput}kWH
      </span>
      {"today, That's on track to reach"}
      <span className='mx-1.5 text-3xl font-bold text-brand-primary'>
        {dailyProjectedPercentage}%
      </span>
      of your daily average.
    </span>
  );
}
