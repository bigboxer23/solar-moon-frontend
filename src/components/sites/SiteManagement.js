import React, { useEffect, useState } from "react";
import { getDevices } from "../../services/services";
import { Button, Card, CardBody, CardHeader, Dropdown } from "react-bootstrap";
import Site from "./Site";
import { MdAddCircle, MdOutlineAdd } from "react-icons/md";
import NewSiteDialog from "./newSiteDialog";
import NewDeviceDialog from "./NewDeviceDialog";
import Loader from "../common/Loader";

export const noSite = "No Site";
const SiteManagement = () => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [activeSite, setActiveSite] = useState("");
  const [showNewSite, setShowNewSite] = useState(false);
  const [showNewDevice, setShowNewDevice] = useState(false);
  const [newSiteFormVersion, setNewSiteFormVersion] = useState(0);

  useEffect(() => {
    getDevices()
      .then(({ data }) => {
        setDevices(data);
        setLoading(false);
        if (activeSite === "") {
          setActiveSite(data.find((device) => device.virtual)?.name || noSite);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div className={"root-page container d-flex flex-column"}>
      <Card className={devices.length === 0 ? "" : "no-bottom-border-radius"}>
        <CardHeader
          className={
            (devices.length === 0 ? "" : "no-bottom-border ") +
            "d-flex align-items-center flex-wrap"
          }
        >
          <div className={"fs-3 site-name"}>{activeSite}</div>
          <div className={"flex-grow-1"} />
          <Dropdown className={"align-self-end"}>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              {activeSite === "" ? "Loading" : activeSite}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {devices
                .filter((device) => device.virtual)
                .map((site) => {
                  return (
                    <Dropdown.Item
                      as="button"
                      key={site.name}
                      onClick={() => setActiveSite(site.name)}
                    >
                      {site.name}
                    </Dropdown.Item>
                  );
                })}
              <Dropdown.Item
                as="button"
                key={"none"}
                onClick={() => setActiveSite(noSite)}
              >
                {noSite}
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
          <Button
            className={"ms-3"}
            variant={"outline-light"}
            title={"New Device"}
            onClick={() => setShowNewDevice(true)}
          >
            <MdAddCircle
              style={{ marginBottom: "2px", marginRight: ".5rem" }}
            />
            Add Device
          </Button>
        </CardHeader>
        <CardBody className={devices.length === 0 ? "" : "d-none"}>
          <Loader
            loading={loading}
            deviceCount={devices.length}
            content={
              'You don\'t have any devices yet.  Add some by clicking the "Add Device" above!'
            }
          />
        </CardBody>
      </Card>
      {[...devices, { id: noSite, name: noSite, virtual: true }]
        .filter((device) => device.virtual)
        .filter((site) => site.name === activeSite)
        .map((site) => {
          return (
            <Site
              key={site.id}
              data={site}
              devices={devices}
              setDevices={setDevices}
              setActiveSite={setActiveSite}
            />
          );
        })}
      {/*<h3 className={"d-flex fw-bold header mb-0 align-items-center"}>
        <div className={"fs-3 site-name"}>{activeSite}</div>
        <div className={"flex-grow-1"} />
        <Dropdown className={"align-self-end"}>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            {activeSite === "" ? "Loading" : activeSite}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {devices
              .filter((device) => device.virtual)
              .map((site) => {
                return (
                  <Dropdown.Item
                    as="button"
                    key={site.name}
                    onClick={() => setActiveSite(site.name)}
                  >
                    {site.name}
                  </Dropdown.Item>
                );
              })}
            <Dropdown.Item
              as="button"
              key={"none"}
              onClick={() => setActiveSite(noSite)}
            >
              {noSite}
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
        <Button
          className={"ms-3"}
          variant={"outline-light"}
          title={"New Device"}
          onClick={() => setShowNewDevice(true)}
        >
          <MdAddCircle style={{ marginBottom: "2px", marginRight: ".5rem" }} />
          Add Device
        </Button>
      </h3>*/}

      {/* <Card className={"m-3 " + (devices.length === 0 ? "" : "d-none")}>
        <Card.Body>
          <Loader
            loading={loading}
            deviceCount={devices.length}
            content={
              'You don\'t have any devices yet.  Add some by clicking the "Add Device" above!'
            }
          />
        </Card.Body>
      </Card>*/}
      <NewSiteDialog
        key={newSiteFormVersion}
        show={showNewSite}
        setShow={setShowNewSite}
        setDevices={setDevices}
        setActiveSite={setActiveSite}
        setVersion={setNewSiteFormVersion}
      />
      <NewDeviceDialog
        key={"device" + newSiteFormVersion + activeSite}
        show={showNewDevice}
        setShow={setShowNewDevice}
        setDevices={setDevices}
        setVersion={setNewSiteFormVersion}
        devices={devices}
        site={activeSite}
      />
    </div>
  );
};

export default SiteManagement;
