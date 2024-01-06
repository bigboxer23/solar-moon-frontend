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
            id='revokeAccessKey'
            onClick={(e) => {
              e.currentTarget.classList.add('disabled');
              deleteMapping(mappingName);
            }}
            type='button'
            variant='outline-danger'
          >
            <Spinner
              animation='border'
              as='span'
              className='d-none'
              role='status'
              size='sm'
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
