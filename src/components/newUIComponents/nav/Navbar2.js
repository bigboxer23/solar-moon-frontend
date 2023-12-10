import { NavLink } from "react-router-dom";
import { LuSun } from "react-icons/lu";
import logo from "../../../assets/logo.svg";
import React from "react";
import UserMenu from "../../UserMenu";

export default function Navbar2({ props }) {
  return (
    <div className="Navbar2">
      <div className="brand">
        <img src={logo} className="brand-img" alt="brand" />
      </div>
      <nav className="links">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "link-active" : "link")}
        >
          Dashboard
        </NavLink>
        <LuSun className="sun" />
        <NavLink
          to="/sites"
          className={({ isActive }) => (isActive ? "link-active" : "link")}
        >
          Sites
        </NavLink>
        <LuSun className="sun" />
        <NavLink
          to="/reports"
          className={({ isActive }) => (isActive ? "link-active" : "link")}
        >
          Reports
        </NavLink>
        <LuSun className="sun" />
        <NavLink
          to="/alerts"
          className={({ isActive }) => (isActive ? "link-active" : "link")}
        >
          Alerts
        </NavLink>
        <LuSun className="sun" />
        <NavLink
          to="/manage"
          className={({ isActive }) => (isActive ? "link-active" : "link")}
        >
          Manage
        </NavLink>
      </nav>
      <UserMenu />
    </div>
  );
}
