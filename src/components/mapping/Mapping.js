import { useEffect, useState } from 'react';
import { Button, Card, CardBody, ListGroup, Modal } from 'react-bootstrap';
import { MdSettingsInputComposite } from 'react-icons/md';

import { deleteMapping, getMappings } from '../../services/services';
import HelpButton from '../HelpButton';
import AddMapping from './AddMapping';
import MappingBlock from './MappingBlock';
import { attributeMappings } from './MappingConstants';

export default function Mapping() {
  const [showMapping, setShowMapping] = useState(false);
  const [mappings, setMappings] = useState([]);

  useEffect(() => {
    getMappings().then(({ data }) => {
      setMappings(data);
    });
  }, []);

  const delMapping = (mappingName) => {
    deleteMapping(mappingName).then(() => {
      getMappings().then(({ data }) => {
        setMappings(data);
      });
    });
  };

  return (
    <div>
      <Button
        className='ms-3'
        onClick={() => setShowMapping(true)}
        variant='outline-light'
      >
        <MdSettingsInputComposite className='button-icon' />
        Mappings
      </Button>
      <Modal
        data-bs-theme='dark'
        onHide={() => setShowMapping(false)}
        show={showMapping}
        size='xl'
      >
        <Modal.Header closeButton>
          <Modal.Title className='d-flex'>
            <div className='pe-3'>Attribute Mappings</div>
            <HelpButton
              text={
                'Mappings provide a way to translate names of data points from your devices to the fields Solar Moon needs' +
                ' to generate graphs, analytics and alerts. There are a number of mappings provided by default, but if you are ' +
                'unable to change your device settings to match them, the platform can map to existing config instead.'
              }
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className=' d-flex flex-column min-vh-95 container'>
            <Card>
              {/*<CardHeader className={"fw-bold d-flex align-items-center"}>
          Attribute Mappings
          <div className={"flex-grow-1"} />
          <HelpButton
            text={
              "Mappings provide a way to translate names of data points from your devices to the fields Solar Moon needs" +
              " to generate graphs, analytics and alerts. There are a number of mappings provided by default, but if you are " +
              "unable to change your device settings to match them, the platform can map to existing config instead."
            }
          />
        </CardHeader>*/}
              <CardBody>
                <AddMapping mappings={mappings} setMappings={setMappings} />
                <ListGroup>
                  {[
                    ...Object.entries(attributeMappings).map(([key, value]) => {
                      return {
                        mappingName: key,
                        attribute: value,
                        readOnly: true,
                      };
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
                </ListGroup>
              </CardBody>
            </Card>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
