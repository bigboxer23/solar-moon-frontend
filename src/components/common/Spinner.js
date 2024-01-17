import classNames from 'classnames';
import { FaRotate } from 'react-icons/fa6';

export default function Spinner({ className }) {
  return <FaRotate className={classNames('animate-spin', className)} />;
}
