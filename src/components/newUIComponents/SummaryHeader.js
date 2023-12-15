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
        label=''
        separator=' '
        unit='kWH'
        value={Math.round(dailyOutput)}
      />
      {"today, That's "}
      <FormattedLabel
        className='mx-1.5 text-3xl font-bold text-brand-primary'
        label=''
        unit='%'
        value={calculatePercent(dailyOutput, dailyAverageOutput)}
      />
      of your daily average.
    </span>
  );
}
