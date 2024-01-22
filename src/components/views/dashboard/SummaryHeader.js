import FormattedLabel from '../../graphs/FormattedLabel';

export default function SummaryHeader({ dailyOutput, dailyAverageOutput }) {
  const calculatePercent = (total, average) => {
    return Math.round((total / average) * 100);
  };
  return (
    <span className='SummaryHeader mx-6 flex flex-wrap items-baseline justify-center space-x-2 space-y-2 py-8 text-xl font-bold'>
      <span className='whitespace-nowrap text-center'>You have generated</span>
      <span className='whitespace-nowrap text-center'>
        <FormattedLabel
          className='mx-1 whitespace-nowrap text-center text-3xl font-bold text-brand-primary'
          label=''
          separator=' '
          unit='kWH'
          value={Math.round(dailyOutput)}
        />
        {'today.'}
      </span>
      <span className='whitespace-nowrap text-center'>
        {"That's "}
        <FormattedLabel
          className='mx-1 whitespace-nowrap text-center text-3xl font-bold text-brand-primary'
          label=''
          unit='%'
          value={calculatePercent(dailyOutput, dailyAverageOutput)}
        />
        of your daily average.
      </span>
    </span>
  );
}
