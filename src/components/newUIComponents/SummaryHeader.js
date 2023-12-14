import FormattedLabel from '../graphs/FormattedLabel';

export default function SummaryHeader({ dailyOutput, dailyAverageOutput }) {
  const calculatePercent = (total, average) => {
    return Math.round((total / average) * 100);
  };
  return (
    <span className='SummaryHeader py-8 text-xl font-bold'>
      You have generated
      <FormattedLabel
        className='mx-1.5 text-3xl font-bold text-brand-primary'
        value={Math.round(dailyOutput)}
        label=''
        separator=' '
        unit='kWH'
      />
      {"today, That's "}
      <FormattedLabel
        className='mx-1.5 text-3xl font-bold text-brand-primary'
        value={calculatePercent(dailyOutput, dailyAverageOutput)}
        label=''
        unit='%'
      />
      of your daily average.
    </span>
  );
}
