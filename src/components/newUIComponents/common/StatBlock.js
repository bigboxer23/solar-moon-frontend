import classNames from 'classnames';

export default function StatBlock({ title, value, className, onClick }) {
  const style = classNames('StatBlock flex space-x-2', className);

  return (
    <div className={style} onClick={onClick}>
      <div className='inline-block self-end text-5xl font-bold leading-[3rem]'>
        {value}
      </div>
      <div className='mb-1 inline-block max-w-[3.3rem] self-end text-base font-bold leading-[1.125rem]'>
        {title}
      </div>
    </div>
  );
}
