import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { DAY, HOUR, MONTH, WEEK, YEAR } from '../../services/search';

const PeriodToggle = ({ time, setTime }) => {
  return (
    <ToggleButtonGroup
      type='radio'
      name='time-period'
      value={time}
      onChange={(t) => setTime(t)}
      className='ms-3'
    >
      <ToggleButton
        variant='secondary'
        name='time-period'
        id='tbg-btn-1'
        value={HOUR}
      >
        Hr
      </ToggleButton>
      <ToggleButton
        variant='secondary'
        name='time-period'
        id='tbg-btn-2'
        value={DAY}
      >
        D
      </ToggleButton>
      <ToggleButton
        variant='secondary'
        name='time-period'
        id='tbg-btn-3'
        value={WEEK}
      >
        Wk
      </ToggleButton>
      <ToggleButton
        variant='secondary'
        name='time-period'
        id='tbg-btn-4'
        value={MONTH}
      >
        Mo
      </ToggleButton>
      <ToggleButton
        variant='secondary'
        name='time-period'
        id='tbg-btn-5'
        value={YEAR}
      >
        Yr
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
export default PeriodToggle;
