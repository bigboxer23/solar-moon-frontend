import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { MdOutlineDashboard, MdSolarPower } from "react-icons/md";
import { BsAlarm, BsDatabase } from "react-icons/bs";
import { useAuthenticator } from "@aws-amplify/ui-react";
import UserMenu from "./UserMenu";

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColor, updateNavbar] = useState(false);
  const { signOut } = useAuthenticator((context) => [context.user]);
  const { route } = useAuthenticator((context) => [context.route]);

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

  window.addEventListener("scroll", scrollHandler);

  return route === "authenticated" ? (
    <Navbar
      expanded={expand}
      fixed="top"
      expand="md"
      className={navColor ? "sticky" : "navbar"}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex"
          onClick={() => {
            updateExpanded(expand ? false : "expanded");
          }}
        >
          <img src={logo} className="img-fluid logo" alt="brand" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => {
            updateExpanded(expand ? false : "expanded");
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav defaultActiveKey="/" className={"w-100"}>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="dashboard"
                onClick={() => updateExpanded(false)}
              >
                <MdOutlineDashboard style={{ marginBottom: "2px" }} />{" "}
                Dashboards
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={"text-nowrap"}
                as={Link}
                to="reports"
                onClick={() => updateExpanded(false)}
              >
                <BsDatabase style={{ marginBottom: "2px" }} /> Reports
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="alarms"
                onClick={() => updateExpanded(false)}
              >
                <BsAlarm style={{ marginBottom: "2px" }} /> Alarms
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="sites"
                onClick={() => updateExpanded(false)}
              >
                <MdSolarPower style={{ marginBottom: "2px" }} /> Sites
              </Nav.Link>
            </Nav.Item>
            <div className={"flex-grow-1"}></div>
            <UserMenu />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  ) : (
    <div />
  );
}

export default NavBar;
