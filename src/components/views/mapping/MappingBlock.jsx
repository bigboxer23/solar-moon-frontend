import { useState } from 'react';
import { MdLock, MdOutlineDelete } from 'react-icons/md';

import Button from '../../common/Button';
import Spinner from '../../common/Spinner';

export default function MappingBlock({
  attribute,
  mappingName,
  showDelete,
  deleteMapping,
}) {
  const [loading, setLoading] = useState(false);

  return (
    <div className='MappingBlock flex w-full items-center overflow-hidden rounded-md bg-[#f5f5f5] p-4'>
      <div className='text-sm font-extrabold'>{mappingName}</div>
      <span className='pe-2 ps-2'>{'->'}</span>
      <div className='text-sm italic'>{attribute}</div>
      {showDelete ? (
        <Button
          buttonProps={{
            title: 'Delete Mapping',
          }}
          className='ml-auto'
          disabled={loading}
          onClick={() => {
            setLoading(true);
            deleteMapping(mappingName);
          }}
          variant='outline-danger'
        >
          {!loading && <MdOutlineDelete />}
          {loading && <Spinner />}
        </Button>
      ) : (
        <MdLock className='ml-auto text-text-secondary' />
      )}
    </div>
  );
}
