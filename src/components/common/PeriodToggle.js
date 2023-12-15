import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

import { DAY, HOUR, MONTH, WEEK, YEAR } from '../../services/search';

const PeriodToggle = ({ time, setTime }) => {
  return (
    <ToggleButtonGroup
      className='ms-3'
      name='time-period'
      onChange={(t) => setTime(t)}
      type='radio'
      value={time}
    >
      <ToggleButton
        id='tbg-btn-1'
        name='time-period'
        value={HOUR}
        variant='secondary'
      >
        Hr
      </ToggleButton>
      <ToggleButton
        id='tbg-btn-2'
        name='time-period'
        value={DAY}
        variant='secondary'
      >
        D
      </ToggleButton>
      <ToggleButton
        id='tbg-btn-3'
        name='time-period'
        value={WEEK}
        variant='secondary'
      >
        Wk
      </ToggleButton>
      <ToggleButton
        id='tbg-btn-4'
        name='time-period'
        value={MONTH}
        variant='secondary'
      >
        Mo
      </ToggleButton>
      <ToggleButton
        id='tbg-btn-5'
        name='time-period'
        value={YEAR}
        variant='secondary'
      >
        Yr
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
export default PeriodToggle;
