import { Button, Card, CardBody, ListGroup, Modal } from 'react-bootstrap';
import MappingBlock from './MappingBlock';
import { attributeMappings } from './MappingConstants';
import { useEffect, useState } from 'react';
import { deleteMapping, getMappings } from '../../services/services';
import AddMapping from './AddMapping';
import HelpButton from '../HelpButton';
import { MdSettingsInputComposite } from 'react-icons/md';

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
        variant='outline-light'
        onClick={() => setShowMapping(true)}
      >
        <MdSettingsInputComposite className='button-icon' />
        Mappings
      </Button>
      <Modal
        data-bs-theme='dark'
        show={showMapping}
        size='xl'
        onHide={() => setShowMapping(false)}
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
                          key={m.mappingName}
                          attribute={m.attribute}
                          mappingName={m.mappingName}
                          showDelete={!m.readOnly}
                          deleteMapping={delMapping}
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
