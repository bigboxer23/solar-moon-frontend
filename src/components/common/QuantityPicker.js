import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

function QuantityPicker({ min, max, setCount }) {
  const [disableDec, setDisableDec] = useState(true);
  const [disableInc, setDisableInc] = useState(false);
  const [value, setValue] = useState(min);

  useEffect(() => {
    setCount(value);
  }, [value]);

  const increment = () => {
    const plusState = value + 1;
    if (value < max) {
      setValue(plusState);
    }
    if (value === max - 1) {
      setDisableInc(true);
    }
    if (value === min) {
      setDisableDec(false);
    }
  };

  const decrement = () => {
    const minusState = value - 1;
    if (value > min) {
      setValue(minusState);
      if (value === min + 1) {
        setDisableDec(true);
      }
    } else {
      setValue(min);
    }
    if (value === max) {
      setDisableInc(false);
    }
  };

  return (
    <div className='quantity-picker d-flex align-self-end'>
      <Button
        className={'left-modifier' + (disableDec ? ' disabled' : '')}
        onClick={() => decrement()}
        variant='secondary'
      >
        &ndash;
      </Button>
      <input className='quantity-display' readOnly type='text' value={value} />
      <Button
        className={'right-modifier' + (disableInc ? ' disabled' : '')}
        onClick={() => increment()}
        variant='secondary'
      >
        &#xff0b;
      </Button>
    </div>
  );
}
export default QuantityPicker;
