import type { ReactElement } from 'react';
import { useState } from 'react';
import { BiCopy } from 'react-icons/bi';
import { BsCheckLg } from 'react-icons/bs';
import { useCopyToClipboard } from 'usehooks-ts';

import Button from './Button';

interface CopyButtonProps {
  dataSrc: () => string;
  title?: string;
}

const CopyButton = ({ dataSrc, title }: CopyButtonProps): ReactElement => {
  const [_, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const setCopyState = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button
      buttonProps={{ title }}
      className='copy-button relative w-auto'
      onClick={() => {
        copy(dataSrc());
        setCopyState();
      }}
      variant='icon'
    >
      <BiCopy
        className={
          copied ? 'opacity-0 transition-opacity' : 'transition-opacity'
        }
      />
      <BsCheckLg
        className={
          copied ? 'transition-opacity' : 'opacity-0 transition-opacity'
        }
        color='green'
        style={{
          position: 'absolute',
        }}
      />
    </Button>
  );
};
export default CopyButton;
