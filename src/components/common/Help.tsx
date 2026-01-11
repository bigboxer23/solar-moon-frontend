import Tippy from '@tippyjs/react';
import classnames from 'classnames';
import type { ReactElement, ReactNode } from 'react';
import { FaRegQuestionCircle } from 'react-icons/fa';

interface HelpProps {
  content: ReactNode;
  className?: string;
}

export default function Help({
  content,
  className = '',
}: HelpProps): ReactElement {
  return (
    <Tippy content={content} placement='bottom'>
      <div>
        <FaRegQuestionCircle
          className={classnames('cursor-pointer text-gray-400', className)}
          size={18}
        />
      </div>
    </Tippy>
  );
}
