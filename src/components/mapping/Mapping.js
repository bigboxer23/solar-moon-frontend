import { Card, CardBody, CardHeader, ListGroup } from "react-bootstrap";
import MappingBlock from "./MappingBlock";
import { attributeMappings } from "./MappingConstants";
import { useEffect, useState } from "react";
import { deleteMapping, getMappings } from "../../services/services";
import AddMapping from "./AddMapping";
import HelpButton from "../HelpButton";

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
    <div className={"root-page container d-flex flex-column min-vh-95"}>
      <Card>
        <CardHeader className={"fw-bold d-flex align-items-center"}>
          Attribute Mappings
          <div className={"flex-grow-1"} />
          <HelpButton
            text={
              "Mappings provide a way to translate names of data points from your devices to the fields Solar Moon needs" +
              " to generate graphs, analytics and alerts. There are a number of mappings provided by default, but if you are " +
              "unable to change your device settings to match them, the platform can map to existing config instead."
            }
          />
        </CardHeader>
        <CardBody>
          <AddMapping mappings={mappings} setMappings={setMappings} />
          <ListGroup>
            {[
              ...Object.entries(attributeMappings).map(([key, value]) => {
                return { mappingName: key, attribute: value, readOnly: true };
              }),
              ...mappings,
            ]
              .sort((d1, d2) =>
                d1.attribute.localeCompare(d2.attribute, undefined, {
                  sensitivity: "accent",
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
  );
}
