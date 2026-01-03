import type { ReactElement, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { FaXmark } from 'react-icons/fa6';

import Button from './Button';

type ModalSize = 'sm' | 'md' | 'lg';

const sizes: Record<ModalSize, string> = {
  sm: 'sm:w-64',
  md: 'sm:w-[32rem]',
  lg: 'sm:w-[50rem]',
};

interface ModalProps {
  children: ReactNode;
  size?: ModalSize;
  isOpen?: boolean;
}

export default function Modal({
  children,
  size = 'md',
  isOpen = false,
}: ModalProps): ReactElement | null {
  function renderDialog(): ReactElement {
    return (
      <dialog
        className={`Modal fixed !top-[10%] z-10 !mx-auto w-full rounded-xl bg-white shadow-modal dark:bg-gray-800 sm:!top-1/4 ${sizes[size]}`}
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

interface ModalHeaderProps {
  label: ReactNode;
  onCloseClick?: () => void;
}

export function ModalHeader({
  label,
  onCloseClick,
}: ModalHeaderProps): ReactElement {
  return (
    <div className='ModalHeader flex items-center justify-between border-b border-gray-200 px-6 py-4'>
      <h2 className='ModalHeader text-lg font-bold dark:text-gray-100'>
        {label}
      </h2>
      {onCloseClick && (
        <Button onClick={onCloseClick} variant='icon'>
          <FaXmark size={20} />
        </Button>
      )}
    </div>
  );
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function ModalFooter({
  children,
  className,
}: ModalFooterProps): ReactElement {
  const footerClass = `ModalFooter justify-end w-full flex px-6 pb-4 pt-2 ${className}`;
  return <div className={footerClass}>{children}</div>;
}
