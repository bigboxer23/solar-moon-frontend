import React, { useEffect, useState } from "react";
import {
  getDevice,
  getDevices,
  getSeatCount,
  updateDevice,
} from "../../services/services";
import { Button, Card, CardBody, CardHeader, Dropdown } from "react-bootstrap";
import Site from "./Site";
import { MdAddCircle, MdOutlineAdd } from "react-icons/md";
import NewSiteDialog from "./newSiteDialog";
import NewDeviceDialog from "./NewDeviceDialog";
import Loader from "../common/Loader";
import { sortDevices, useStickyState } from "../../utils/Utils";
import { useSearchParams } from "react-router-dom";

export const noSite = "No Site";
const SiteManagement = () => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [activeSite, setActiveSite] = useStickyState("", "site.management");
  const [showNewSite, setShowNewSite] = useState(false);
  const [showNewDevice, setShowNewDevice] = useState(false);
  const [newSiteFormVersion, setNewSiteFormVersion] = useState(0);
  const [subscriptionDevices, setSubscriptionDevices] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const disableNotifications = searchParams.get("disable");
    if (disableNotifications === null) {
      loadDevices();
      return;
    }
    searchParams.delete("disable");
    setSearchParams(searchParams);
    getDevice(disableNotifications).then(({ data }) => {
      updateDevice({ ...data, notificationsDisabled: true }).then(() => {
        loadDevices();
      });
    });
  }, []);

  const loadDevices = () => {
    getDevices()
      .then(({ data }) => {
        setDevices(data);
        setLoading(false);
        if (activeSite === "") {
          setActiveSite(data.find((device) => device.virtual)?.name || noSite);
        }
      })
      .catch((e) => {
        setLoading(false);
      });
    getSeatCount().then(({ data }) => {
      setSubscriptionDevices(data * 10);
    });
  };

  const isDisabledForSubscription = () => {
    return subscriptionDevices > devices.length ? "" : " disabled";
  };

  const getNewSiteContent = () => {
    return subscriptionDevices > devices.length ? (
      <div>
        <Dropdown.Divider />
        <Dropdown.Item
          as="button"
          eventKey="new"
          className={"Success"}
          onClick={() => setShowNewSite(true)}
        >
          <MdOutlineAdd className={"button-icon"} />
          Create New Site
        </Dropdown.Item>
      </div>
    ) : (
      ""
    );
  };

  return (
    <div className={"root-page container d-flex flex-column min-vh-95"}>
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
                .sort(sortDevices)
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
              {getNewSiteContent()}
            </Dropdown.Menu>
          </Dropdown>
          <Button
            className={"ms-3" + isDisabledForSubscription()}
            variant={"outline-light"}
            title={
              isDisabledForSubscription()
                ? "Increase the number of seats to add more devices"
                : "New Device"
            }
            onClick={() => setShowNewDevice(true)}
          >
            <MdAddCircle className={"button-icon"} />
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
