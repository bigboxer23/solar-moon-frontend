import React, { useEffect, useState } from "react";
import { getDevices } from "../../services/services";
import { Card, Dropdown } from "react-bootstrap";
import Site from "./Site";
import { MdOutlineAdd } from "react-icons/md";
import NewSiteDialog from "./newSiteDialog";
const SiteManagement = () => {
  const [devices, setDevices] = useState([]);
  const [activeSite, setActiveSite] = useState("");
  const [noDevices, setNoDevices] = useState("");
  const [showNewSite, setShowNewSite] = useState(false);

  useEffect(() => {
    getDevices()
      .then(({ data }) => {
        setDevices(data);
        if (activeSite === "") {
          setActiveSite(data.find((device) => device.virtual)?.name);
        }
      })
      .catch((e) => {
        console.log(e);
        setNoDevices(e.response.data);
      });
  }, []);

  return (
    <div className={"root-page container d-flex flex-column"}>
      <h4 className={"d-flex fw-bold header mb-3 align-items-center"}>
        <div className={"flex-grow-1"}>Site: {activeSite}</div>
        <Dropdown className={"align-self-end"}>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Choose Site
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {devices
              .filter((device) => device.virtual)
              .map((site) => {
                return (
                  <Dropdown.Item
                    as="button"
                    key={site.id}
                    onClick={() => setActiveSite(site.name)}
                  >
                    {site.name}
                  </Dropdown.Item>
                );
              })}
            <Dropdown.Item
              as="button"
              key={"none"}
              onClick={() => setActiveSite("No Site")}
            >
              No Site
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              as="button"
              eventKey="new"
              className={"Success"}
              onClick={() => setShowNewSite(true)}
            >
              <MdOutlineAdd
                style={{
                  marginBottom: "2px",
                  marginRight: "6px",
                }}
              />
              Create New Site
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </h4>
      {devices
        .filter((device) => device.virtual)
        .filter((site) => site.name === activeSite)
        .map((site) => {
          return (
            <Site
              key={site.id}
              data={site}
              devices={devices}
              setDevices={setDevices}
            />
          );
        })}
      <Card className={"m-5 " + (noDevices.length > 0 ? "" : "d-none")}>
        <Card.Body>{noDevices}</Card.Body>
      </Card>
      <NewSiteDialog
        show={showNewSite}
        setShow={setShowNewSite}
        setDevices={setDevices}
      />
    </div>
  );
};

export default SiteManagement;
