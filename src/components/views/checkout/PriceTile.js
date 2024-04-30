import { activateTrial } from '../../../services/services';
import Button from '../../common/Button';
import QuantityPicker from './QuantityPicker';

function PriceTile({
  label,
  label2,
  label3,
  count,
  setCount,
  priceId,
  price,
  checkoutClicked,
  buttonText = 'Choose plan',
  showBottomContent = true,
}) {
  return (
    <div className='PriceTile fade-in grow-1 m-3 my-8 me-2 ms-2 flex min-h-[17rem] w-full max-w-[17rem] flex-col rounded-lg bg-white p-8 shadow-panel dark:bg-gray-800 sm:me-5 sm:ms-5 '>
      <div className='flex h-full flex-col'>
        <div className='mb-3 flex items-center'>
          <div className='text-xl font-bold text-black dark:text-gray-100'>
            {label}
          </div>
          <div className='ps-2 text-gray-500 dark:text-gray-400'>{label3}</div>
        </div>
        <div className='mb-1 flex items-center'>
          <div className='text-lg text-black dark:text-gray-100'>
            {20 * count}
          </div>
          <div className='ps-1 text-sm text-gray-500 dark:text-gray-400'>
            {' '}
            devices
          </div>
        </div>
        <div className='mb-1 flex items-center'>
          <div className='text-lg text-black dark:text-gray-100'>
            ${price * count}
          </div>
          {label2 && (
            <div className='ps-1 text-sm text-gray-500 dark:text-gray-400'>
              {' '}
              {label2}
            </div>
          )}
        </div>
        <div className='mb-3 flex'>
          {showBottomContent && (
            <div className='smaller-text text-sm text-gray-500 dark:text-gray-400'>
              ${price} per seat {label2}
            </div>
          )}
        </div>
        <div className='grow' />
        {showBottomContent && (
          <>
            <div className='mb-1 me-2 self-start text-sm text-gray-500 dark:text-gray-400'>
              Seats
            </div>
            <QuantityPicker
              className='mb-3 self-center'
              max={10}
              min={1}
              setCount={setCount}
            />
          </>
        )}
        <Button
          className='mt-3 justify-center'
          onClick={() => checkoutClicked(priceId, count)}
          type='button'
          variant='primary'
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
export default PriceTile;
