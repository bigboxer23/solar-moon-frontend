import { useEffect, useState } from 'react';

import { deleteMapping, getMappings } from '../../../../services/services';
import Help from '../../common/Help';
import AddMapping from './AddMapping';
import MappingBlock from './MappingBlock';
import { attributeMappings } from './MappingConstants';

export default function Mapping() {
  const [mappings, setMappings] = useState([]);
  useEffect(() => {
    getMappings().then(({ data }) => {
      setMappings(data);
    });
  }, []);

  const delMapping = (mappingName) => {
    deleteMapping(mappingName).then(({ data }) => {
      getMappings().then(({ data }) => {
        setMappings(data);
      });
    });
  };

  return (
    <main className='Mapping flex w-full flex-col items-center justify-center'>
      <div className='fade-in my-8 w-[55rem] max-w-full rounded-lg bg-white p-6 shadow-panel sm:p-8'>
        <div className='mb-10 flex w-full items-center space-x-1'>
          <span className='text-lg font-bold'>Attribute Mappings</span>
          <Help content='Mappings provide a way to translate names of data points from your devices to the fields Solar Moon needs to generate graphs, analytics and alerts. There are a number of mappings provided by default, but if you are unable to change your device settings to match them, the platform can map to existing config instead.' />
        </div>
        <div>
          <AddMapping mappings={mappings} setMappings={setMappings} />
          <div className='space-y-4'>
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
              .map((m) => {
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
