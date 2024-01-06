import Tippy from '@tippyjs/react';
import { FaRegQuestionCircle } from 'react-icons/fa';

export default function Help({ content }) {
  return (
    <Tippy content={content} placement='bottom'>
      <div>
        <FaRegQuestionCircle
          className='cursor-pointer text-neutral-400'
          size={18}
        />
      </div>
    </Tippy>
  );
}
