import { useEffect, useState } from 'react';

import Button from '../../common/Button';

interface QuantityPickerProps {
  min: number;
  max: number;
  setCount: (count: number) => void;
  className?: string;
}

function QuantityPicker({
  min,
  max,
  setCount,
  className,
}: QuantityPickerProps): React.ReactElement {
  const [disableDec, setDisableDec] = useState<boolean>(true);
  const [disableInc, setDisableInc] = useState<boolean>(false);
  const [value, setValue] = useState<number>(min);

  useEffect(() => {
    setCount(value);
  }, [value, setCount]);

  const increment = (): void => {
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

  const decrement = (): void => {
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
    <div className={`${className} quantity-picker flex self-end`}>
      <Button
        className='rounded-r-none dark:bg-gray-500 dark:disabled:bg-gray-800'
        disabled={disableDec}
        onClick={() => decrement()}
        variant='secondary'
      >
        &ndash;
      </Button>
      <input
        className='quantity-display min-h-full w-12 select-none border-0 text-center outline-hidden'
        readOnly
        type='text'
        value={value}
      />
      <Button
        className='rounded-l-none dark:bg-gray-500 dark:disabled:bg-gray-800'
        disabled={disableInc}
        onClick={() => increment()}
        variant='secondary'
      >
        &#xff0b;
      </Button>
    </div>
  );
}
export default QuantityPicker;
