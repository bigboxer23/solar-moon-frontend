import ReactDOM from 'react-dom';
import { FaXmark } from 'react-icons/fa6';

import Button from './Button';

const sizes = {
  sm: 'w-64',
  md: 'w-[32rem]',
  lg: 'w-[50rem]',
};

export default function Modal({ children, size = 'md', isOpen = false }) {
  function renderDialog() {
    return (
      <dialog
        className={`Modal fixed !top-1/4 z-10 !mx-auto rounded-xl bg-white shadow-modal dark:bg-gray-800 ${sizes[size]}`}
        open={isOpen}
      >
        {children}
      </dialog>
    );
  }

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(renderDialog(), document.body);
}

export function ModalHeader({ label, onCloseClick }) {
  return (
    <div className='ModalHeader flex items-center justify-between border-b border-gray-200 px-6 py-4'>
      <h2 className='ModalHeader text-lg font-bold'>{label}</h2>
      {onCloseClick && (
        <Button onClick={onCloseClick} variant='icon'>
          <FaXmark size={20} />
        </Button>
      )}
    </div>
  );
}

export function ModalFooter({ children, className }) {
  const footerClass = `ModalFooter justify-end w-full flex px-6 pb-4 pt-2 ${className}`;
  return <div className={footerClass}>{children}</div>;
}
