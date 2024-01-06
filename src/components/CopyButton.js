import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { BiCopy } from 'react-icons/bi';
import { BsCheckLg } from 'react-icons/bs';
import { useCopyToClipboard } from 'usehooks-ts';

const CopyButton = (props) => {
  const [_, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const setCopyState = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button
      className='copy-button position-relative ms-2 w-auto'
      onClick={() => {
        copy(props.dataSrc());
        setCopyState();
      }}
      title={props.title}
      type='button'
      variant='outline-secondary'
    >
      <BiCopy
        className={copied ? 'fade' : 'fade show'}
        style={{ marginBottom: '2px' }}
      />
      <BsCheckLg
        className={copied ? 'fade show' : 'fade'}
        color='green'
        style={{
          marginBottom: '2px',
          left: 12,
          top: 12,
          position: 'absolute',
        }}
      />
    </Button>
  );
};
export default CopyButton;
