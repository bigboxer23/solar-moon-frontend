import Tippy from '@tippyjs/react';
import classnames from 'classnames';
import { FaRegQuestionCircle } from 'react-icons/fa';

export default function Help({ content, className = '' }) {
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
