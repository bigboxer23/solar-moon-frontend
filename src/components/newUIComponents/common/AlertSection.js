import Button from './Button';

export default function AlertSection({
  title,
  buttonTitle,
  show,
  setShow,
  onClick,
}) {
  return (
    show && (
      <div className='mt-8 rounded-lg border-2 border-danger p-4'>
        <div className='mb-2 flex w-full justify-between text-danger'>
          <span className='text-lg font-bold'>{title}</span>
        </div>
        <div className='mt-8 flex content-end'>
          <Button
            className='ml-auto'
            onClick={() => setShow(false)}
            variant='secondary'
          >
            Cancel
          </Button>
          <Button
            className='ml-auto ms-2'
            onClick={() => {
              setShow(false);
              onClick();
            }}
            variant='outline-danger'
          >
            {buttonTitle}
          </Button>
        </div>
      </div>
    )
  );
}
