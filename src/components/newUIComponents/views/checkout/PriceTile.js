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
}) {
  return (
    <div className='price fade-in grow-1 m-3 my-8 me-2 ms-2 flex min-h-[17rem] w-full max-w-[17rem] flex-col rounded-lg bg-white p-8 shadow-panel sm:me-5 sm:ms-5 '>
      <div className='flex flex-col'>
        <div className='mb-3 flex items-center'>
          <div className='text-xl font-bold'>{label}</div>
          <div className='ps-2 text-gray-500'>{label3}</div>
        </div>
        <div className='mb-1 flex items-center'>
          <div className='text-lg'>{20 * count}</div>
          <div className='ps-1 text-sm text-gray-500'> devices</div>
        </div>
        <div className='mb-1 flex items-center'>
          <div className='text-lg'>${price * count}</div>
          <div className='ps-1 text-sm text-gray-500'> per {label2}</div>
        </div>
        <div className='mb-3 flex'>
          <div className='smaller-text  text-sm text-gray-500'>
            ${price} per seat per {label2}
          </div>
        </div>
        <div className='grow-1' />
        <div className='mb-1 me-2 self-start text-sm text-gray-500'>Seats</div>
        <QuantityPicker
          className='mb-3 self-center'
          max={10}
          min={1}
          setCount={setCount}
        />
        <Button
          className='mt-3 justify-center'
          onClick={() => checkoutClicked(priceId, count)}
          type='button'
          variant='primary'
        >
          Choose plan
        </Button>
      </div>
    </div>
  );
}
export default PriceTile;
