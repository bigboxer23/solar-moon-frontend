import { useStickyState } from '../../utils/Utils';
import GroupedBarChart from './GroupedBarGraph';
import SiteGraphToggle from './SiteGraphToggle';
import StackedTimeSeries from './StackedTimeSeries';
import TimeSeries from './TimeSeries';

const SiteGraph = ({ site, time }) => {
  const [graph, setGraph] = useStickyState('Combined', 'site.graph');

  return (
    <div className='d-flex flex-column'>
      {site.subtraction ? (
        ''
      ) : (
        <SiteGraphToggle graph={graph} setGraph={setGraph} />
      )}

      {graph === 'Combined' || site.subtraction ? (
        <TimeSeries device={site} time={time} />
      ) : graph === 'Stacked' ? (
        <StackedTimeSeries device={site} time={time} />
      ) : (
        <GroupedBarChart device={site} time={time} />
      )}
    </div>
  );
};
export default SiteGraph;
