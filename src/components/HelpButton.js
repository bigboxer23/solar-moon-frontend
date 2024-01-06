import { OverlayTrigger, Popover } from 'react-bootstrap';
import { MdOutlineHelpOutline } from 'react-icons/md';

export default function HelpButton({ text }) {
  return (
    <OverlayTrigger
      delay={{ show: 200, hide: 750 }}
      overlay={
        <Popover data-bs-theme='dark'>
          <Popover.Body>{text}</Popover.Body>
        </Popover>
      }
      placement='auto'
      theme
      trigger={['hover', 'focus', 'click']}
    >
      <div>
        <MdOutlineHelpOutline className='help-button text-muted' />
      </div>
    </OverlayTrigger>
  );
}
