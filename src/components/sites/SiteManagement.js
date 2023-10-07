import React, { useEffect, useState } from "react";
import { getDevices } from "../../services/services";
import { Card, Dropdown } from "react-bootstrap";
import Device from "./Device";
import Site from "./Site";
import { MdOutlineAdd } from "react-icons/md";
const SiteManagement = () => {
  const [devices, setDevices] = useState([]);
  const [sites, setSites] = useState([]);
  const [activeSite, setActiveSite] = useState("");
  const [noDevices, setNoDevices] = useState("");
  useEffect(() => {
    getDevices()
      .then(({ data }) => {
        setDevices(data);
        let s = data.filter((device) => device.virtual);
        s[s.length] = { id: "none", name: "No Site" }; //Add placeholder site
        setSites(s);
        setActiveSite(s.length > 0 ? s[0].name : "");
      })
      .catch((e) => {
        console.log(e);
        setNoDevices(e.response.data);
      });
  }, []);

  const deviceUI = devices.map((device) => {
    return <Device key={device.id} data={device} setDevices={setDevices} />;
  });

  return (
    <div className={"root-page container d-flex flex-column"}>
      <h4 className={"d-flex fw-bold header mb-3 align-items-center"}>
        <div className={"flex-grow-1"}>Site: {activeSite}</div>
        <Dropdown className={"align-self-end"}>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Choose Site
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {sites.map((site) => {
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
            <Dropdown.Divider />
            <Dropdown.Item as="button" eventKey="new" className={"Success"}>
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
      {sites
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
    </div>
  );
};

export default SiteManagement;
