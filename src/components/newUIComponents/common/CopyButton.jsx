import { useState } from 'react';
import { BiCopy } from 'react-icons/bi';
import { BsCheckLg } from 'react-icons/bs';
import { useCopyToClipboard } from 'usehooks-ts';

import Button from './Button';

const CopyButton = (props) => {
  const [_, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const setCopyState = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button
      buttonProps={{ title: props.title }}
      className='copy-button relative w-auto'
      onClick={() => {
        copy(props.dataSrc());
        setCopyState();
      }}
      type='button'
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
