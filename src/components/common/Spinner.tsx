import classNames from 'classnames';
import type { ReactElement } from 'react';
import { FaRotate } from 'react-icons/fa6';

interface SpinnerProps {
  className?: string;
}

export default function Spinner({ className }: SpinnerProps): ReactElement {
  return <FaRotate className={classNames('animate-spin', className)} />;
}
