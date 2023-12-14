import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

const SiteGraphToggle = ({ graph, setGraph }) => {
  return (
    <ToggleButtonGroup
      type='radio'
      name='site-graph'
      value={graph}
      onChange={(t) => setGraph(t)}
      className='align-self-end'
    >
      <ToggleButton
        variant='secondary'
        name='site-graph'
        id='tbg-btn-Combined'
        value='Combined'
      >
        Combined
      </ToggleButton>
      <ToggleButton
        variant='secondary'
        name='site-graph'
        id='tbg-btn-Stacked'
        value='Stacked'
      >
        Stacked
      </ToggleButton>
      <ToggleButton
        variant='secondary'
        name='site-graph'
        id='tbg-btn-Stacked-Bar'
        value='Grouped'
      >
        Grouped
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
export default SiteGraphToggle;
