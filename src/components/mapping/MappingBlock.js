import { Button, ListGroup, Spinner } from 'react-bootstrap';
import { MdLock, MdOutlineDelete } from 'react-icons/md';

export default function MappingBlock({
  attribute,
  mappingName,
  showDelete,
  deleteMapping,
}) {
  return (
    <ListGroup.Item>
      <div className='d-flex mapping-block align-items-center'>
        <code>{mappingName}</code>
        <span className='pe-2 ps-2'>{'->'}</span>
        <kbd>{attribute}</kbd>
        <div className='grow-1'></div>
        {showDelete ? (
          <Button
            className='hidden-without-hover'
            type='button'
            onClick={(e) => {
              e.currentTarget.classList.add('disabled');
              deleteMapping(mappingName);
            }}
            variant='outline-danger'
            id='revokeAccessKey'
          >
            <Spinner
              as='span'
              animation='border'
              size='sm'
              role='status'
              className='d-none'
            />
            <MdOutlineDelete />
          </Button>
        ) : (
          <MdLock className='text-muted' />
        )}
      </div>
    </ListGroup.Item>
  );
}
