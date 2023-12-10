import { Button, Col, Form, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import { attributeMappings, attributes, AVG_CURRENT } from "./MappingConstants";
import { MdOutlineAddCircle } from "react-icons/md";
import { addMapping } from "../../services/services";
import { onEnterPressed, preventSubmit } from "../../utils/Utils";

const AddMapping = ({ mappings, setMappings }) => {
  const [mapping, setMapping] = useState({
    mappingName: "",
    attribute: AVG_CURRENT,
  });

  const compare = (d) => {
    return (
      d.mappingName.localeCompare(mapping.mappingName.trim(), undefined, {
        sensitivity: "accent",
      }) === 0
    );
  };
  const addMappingClicked = () => {
    if (mapping.mappingName.trim() === "") {
      return;
    }
    if (
      Object.entries(attributeMappings)
        .map((d) => {
          return { mappingName: d[0] };
        })
        .find(compare) !== undefined ||
      attributes
        .map((d) => {
          return {
            mappingName: d,
          };
        })
        .find(compare) !== undefined
    ) {
      console.log("not adding, already found in default list");
      return;
    }
    if (mappings.find(compare) !== undefined) {
      console.log("not adding, already found in custom list");
      return;
    }
    document.getElementById("add-mapping-button").classList.add("disabled");
    addMapping(mapping.attribute, mapping.mappingName.trim())
      .then(({ data }) => {
        setMappings([
          ...mappings,
          {
            mappingName: mapping.mappingName.trim(),
            attribute: mapping.attribute,
          },
        ]);
        setMapping({
          mappingName: "",
          attribute: AVG_CURRENT,
        });
        document
          .getElementById("add-mapping-button")
          .classList.remove("disabled");
      })
      .catch(() =>
        document
          .getElementById("add-mapping-button")
          .classList.remove("disabled"),
      );
  };
  return (
    <Form className={""}>
      <div className="d-flex align-items-end mb-3">
        <Form.Group as={Col} controlId="mapping">
          <Form.Label>Mapping name</Form.Label>
          <Form.Control
            value={mapping.mappingName}
            onChange={(e) =>
              setMapping({ ...mapping, mappingName: e.target.value })
            }
            onKeyPress={preventSubmit}
            onKeyUp={(event) => onEnterPressed(event, addMappingClicked)}
          />
        </Form.Group>
        <div className={"p-2"}>-></div>
        <Form.Group as={Col} controlId="attribute">
          <Form.Label>Attribute</Form.Label>
          <Form.Select
            aria-label="site select"
            value={mapping.attribute}
            onChange={(e) =>
              setMapping({ ...mapping, attribute: e.target.value })
            }
          >
            {attributes.map((attr) => {
              return (
                <option key={attr} value={attr}>
                  {attr}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
        <Button
          id={"add-mapping-button"}
          className={"ms-3"}
          variant={"outline-light"}
          title={"Add Attribute"}
          onClick={addMappingClicked}
        >
          <MdOutlineAddCircle style={{ marginBottom: "2px" }} />
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            className={"d-none"}
          />
        </Button>
      </div>
    </Form>
  );
};
export default AddMapping;
