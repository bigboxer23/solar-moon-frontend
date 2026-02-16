import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

import { deleteMapping, getMappings } from '../../../services/services';
import type { Mapping as MappingType } from '../../../types/models';
import { MAPPING_HELP_TEXT } from '../../../utils/HelpText';
import Help from '../../common/Help';
import AddMapping from './AddMapping';
import MappingBlock from './MappingBlock';
import { attributeMappings } from './MappingConstants';

interface MappingWithReadOnly extends MappingType {
  readOnly?: boolean;
}

export default function Mapping() {
  const [mappings, setMappings] = useState<MappingType[]>([]);

  useEffect(() => {
    getMappings().then(({ data }) => {
      setMappings(data);
    });
  }, []);

  const delMapping = (mappingName: string) => {
    deleteMapping(mappingName).then(() => {
      getMappings().then(({ data }) => {
        setMappings(data);
      });
    });
  };

  return (
    <main className='Mapping flex w-full flex-col items-center justify-center'>
      <div className='fade-in my-8 flex w-[55rem] max-w-full flex-col bg-white p-6 shadow-panel dark:bg-gray-800 sm:rounded-lg sm:p-8'>
        <NavLink
          className='mb-4 flex items-center self-start text-xs text-gray-500 hover:underline dark:text-gray-400'
          to='/manage'
        >
          <FaArrowLeft className='mr-2 inline-block' size='12' />
          <span>Back to manage</span>
        </NavLink>
        <div className='mb-10 flex w-full items-center gap-x-1'>
          <span className='text-lg font-bold dark:text-white'>
            Attribute Mappings
          </span>
          <Help content={MAPPING_HELP_TEXT} />
        </div>
        <div>
          <AddMapping mappings={mappings} setMappings={setMappings} />
          <div className='gap-y-4'>
            {[
              ...Object.entries(attributeMappings).map(([key, value]) => {
                return { mappingName: key, attribute: value, readOnly: true };
              }),
              ...mappings,
            ]
              .sort((d1, d2) =>
                d1.attribute.localeCompare(d2.attribute, undefined, {
                  sensitivity: 'accent',
                }),
              )
              .map((m: MappingWithReadOnly) => {
                return (
                  <MappingBlock
                    attribute={m.attribute}
                    deleteMapping={delMapping}
                    key={m.mappingName}
                    mappingName={m.mappingName}
                    showDelete={!m.readOnly}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </main>
  );
}
