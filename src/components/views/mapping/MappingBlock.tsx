import { useState } from 'react';
import { MdLock, MdOutlineDelete } from 'react-icons/md';

import Button from '../../common/Button';
import Spinner from '../../common/Spinner';

interface MappingBlockProps {
  attribute: string;
  mappingName: string;
  showDelete: boolean;
  deleteMapping: (mappingName: string) => void;
}

export default function MappingBlock({
  attribute,
  mappingName,
  showDelete,
  deleteMapping,
}: MappingBlockProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div className='MappingBlock flex w-full items-center overflow-hidden rounded-md bg-grid-background-alt p-4 dark:bg-gray-700 dark:text-gray-100'>
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
          variant='secondary'
        >
          {!loading && <MdOutlineDelete />}
          {loading && <Spinner />}
        </Button>
      ) : (
        <MdLock className='ml-auto text-gray-400' />
      )}
    </div>
  );
}
