export default function SummaryHeader() {
  // TODO: Use real data here

  const dailyOutput = 36;
  const dailyProjectedPercentage = 95;
  return (
    <span className="summary-header">
      You have generated{" "}
      <span className="summary-emphasized">{dailyOutput}kWH</span> today, That's
      on track to reach{" "}
      <span className="summary-emphasized">{dailyProjectedPercentage}%</span> of
      your daily average.
    </span>
  );
}
