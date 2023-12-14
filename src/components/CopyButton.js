import { BiCopy } from 'react-icons/bi';
import { BsCheckLg } from 'react-icons/bs';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
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
      title={props.title}
      type='button'
      variant='outline-secondary'
      className='copy-button position-relative ms-2 w-auto'
      onClick={() => {
        copy(props.dataSrc());
        setCopyState();
      }}
    >
      <BiCopy
        className={copied ? 'fade' : 'fade show'}
        style={{ marginBottom: '2px' }}
      />
      <BsCheckLg
        color='green'
        className={copied ? 'fade show' : 'fade'}
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
