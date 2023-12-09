import { Card, CardBody, CardHeader, ListGroup } from "react-bootstrap";
import MappingBlock from "./MappingBlock";
import { attributeMappings } from "./MappingConstants";
import { useEffect, useState } from "react";
import { deleteMapping, getMappings } from "../../services/services";
import AddMapping from "./AddMapping";

const Mapping = () => {
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
    <div className={"root-page container d-flex flex-column min-vh-95"}>
      <Card>
        <CardHeader className={"fw-bold"}>Attribute Mappings</CardHeader>
        <CardBody>
          <div className={"h5"}>Default Mappings</div>
          <ListGroup>
            {Object.entries(attributeMappings)
              .sort((d1, d2) =>
                d1[1].localeCompare(d2[1], undefined, {
                  sensitivity: "accent",
                }),
              )
              .map(([key, value]) => {
                return (
                  <MappingBlock
                    key={key}
                    attribute={value}
                    mappingName={key}
                    showDelete={false}
                    deleteMapping={delMapping}
                  />
                );
              })}
          </ListGroup>
          <div className={"pt-5 h5"}>Custom Mappings</div>
          <AddMapping mappings={mappings} setMappings={setMappings} />
          <ListGroup>
            {mappings.map((m) => {
              return (
                <MappingBlock
                  key={m.mappingName}
                  attribute={m.attribute}
                  mappingName={m.mappingName}
                  showDelete={true}
                  deleteMapping={delMapping}
                />
              );
            })}
          </ListGroup>
        </CardBody>
      </Card>
    </div>
  );
};
export default Mapping;
