import classNames from 'classnames';
import type { ReactElement, ReactNode } from 'react';

interface StatBlockProps {
  title: ReactNode;
  value: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function StatBlock({
  title,
  value,
  className,
  onClick,
}: StatBlockProps): ReactElement {
  const style = classNames('StatBlock flex gap-x-2', className, {
    'cursor-pointer': onClick,
  });

  return (
    <div className={style} onClick={onClick}>
      <div className='inline-block self-end text-5xl leading-[3rem] font-bold'>
        {value}
      </div>
      <div className='mb-1 inline-block max-w-[3.3rem] self-end text-left text-base leading-[1.125rem] font-bold'>
        {title}
      </div>
    </div>
  );
}
