import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

const SiteGraphToggle = ({ graph, setGraph }) => {
  return (
    <ToggleButtonGroup
      className='align-self-end'
      name='site-graph'
      onChange={(t) => setGraph(t)}
      type='radio'
      value={graph}
    >
      <ToggleButton
        id='tbg-btn-Combined'
        name='site-graph'
        value='Combined'
        variant='secondary'
      >
        Combined
      </ToggleButton>
      <ToggleButton
        id='tbg-btn-Stacked'
        name='site-graph'
        value='Stacked'
        variant='secondary'
      >
        Stacked
      </ToggleButton>
      <ToggleButton
        id='tbg-btn-Stacked-Bar'
        name='site-graph'
        value='Grouped'
        variant='secondary'
      >
        Grouped
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
export default SiteGraphToggle;
